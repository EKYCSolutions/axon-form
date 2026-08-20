import 'dart:convert';

import 'package:axon_form_flutter/axon_form.dart';
import 'package:axon_form_flutter/src/core/controller/axon_form_engine.dart';
import 'package:axon_form_flutter/src/core/controller/axon_form_engine_factory.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AxonFormProvider extends ChangeNotifier {
  late AxonFormEngine _controller;

  bool _isLoading = true;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  AxonFormGraph? _graph;
  AxonFormGraph? get graph => _graph;

  Map<String, String> _fieldNameToNodeId = {};
  Map<String, String> get fieldNameToNodeId => _fieldNameToNodeId;

  late List<String> _pageIds;

  int _currentPageIndex = 0;
  int get currentPageIndex => _currentPageIndex;

  int _pageCount = 0;
  int get pageCount => _pageCount;

  /*
    Address Inputs variables
  */
  List<String>? _addressNodeIdsToUpdate;
  List<String>? get addressNodeIdsToUpdate => _addressNodeIdsToUpdate;
  //
  int pulse = 0;

  // Pages that failed engine-side validation during navigateToPage (e.g. a
  // required field left empty). FormBuilder watches this to force those
  // pages' Form to (re-)validate, so the failing field(s) show their error
  // on screen instead of the failure only surfacing as a thrown exception.
  final Set<String> _invalidPageIds = {};
  bool isPageInvalid(String pageId) => _invalidPageIds.contains(pageId);

  AxonFormProvider(Future<Uint8List> Function() loader) {
    initialize(loader);
  }

  Future<void> initialize(Future<Uint8List> Function() loader) async {
    try {
      _controller = createAxonFormEngine();
      final jsonBytes = await loader();
      //
      CoreResponse result = await _controller.initialize(jsonBytes);
      //
      if (!result.success || result.data == null) {
        throw Exception(result.error);
      }
      //
      _graph = AxonFormGraph.fromJson(result.data!);

      if (_graph?.pages == null) {
        throw Exception(
          "[AxonFormProvider: initialize] There was a problem initializing the form",
        );
      }

      _fieldNameToNodeId = {
        for (var node in _graph!.nodes['inputs']!.values)
          node.fieldName: node.id,
      };

      var pagesToShow = _graph?.nodes["pages"]?.entries
          .where((entry) => entry.value.isVisible)
          .map((entry) => entry.key)
          .toList();

      if (pagesToShow == null) {
        throw Exception(
          "[AxonFormProvider: initialize] No visible pages found",
        );
      }

      _graph!.pagesToShow = Map.fromEntries(
        _graph!.pages.entries.where((entry) => pagesToShow.contains(entry.key)),
      ).values.toList();

      _graph!.pagesToShow.sort((a, b) => a.order.compareTo(b.order));

      _pageIds = _graph!.pagesToShow.map((e) => e.id).toList();
      _pageCount = _graph!.pagesToShow.length;

      addEventListener('onNodeValidatedChanged', (data) {});
      addEventListener('onNodeVisibilityChanged', (data) {
        var showNodeIds = (data["show_node_ids"] as List).cast<String>();
        var hideNodeIds = (data["hide_node_ids"] as List).cast<String>();

        void updateVisibility(List<String> ids, bool isVisible) {
          for (var id in ids) {
            // Check inputs
            if (_graph?.nodes['inputs']?.containsKey(id) ?? false) {
              var node = _graph!.nodes['inputs']![id]!;
              _graph!.nodes['inputs']![id] = node.copyWith(
                isVisible: isVisible,
              );
            }
            // Check pages
            if (_graph?.nodes['pages']?.containsKey(id) ?? false) {
              var node = _graph!.nodes['pages']![id]!;
              _graph!.nodes['pages']![id] = node.copyWith(isVisible: isVisible);

              var pagesToShow = _graph?.nodes["pages"]?.entries
                  .where((entry) => entry.value.isVisible)
                  .map((entry) => entry.key)
                  .toList();

              if (pagesToShow == null) {
                throw Exception("No visible pages found");
              }

              _graph!.pagesToShow = Map.fromEntries(
                _graph!.pages.entries.where(
                  (entry) => pagesToShow.contains(entry.key),
                ),
              ).values.toList();

              _graph!.pagesToShow.sort((a, b) => a.order.compareTo(b.order));

              _pageIds = _graph!.pagesToShow.map((e) => e.id).toList();
              _pageCount = _graph!.pagesToShow.length;
            }
          }
        }

        if (showNodeIds.isNotEmpty) {
          updateVisibility(showNodeIds, true);
        }

        if (hideNodeIds.isNotEmpty) {
          updateVisibility(hideNodeIds, false);
        }

        WidgetsBinding.instance.addPostFrameCallback((_) => notifyListeners());
      });
    } catch (e) {
      _errorMessage = "[AxonFormProvider: initialize] ${e.toString()}";
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void addEventListener(
    String event,
    void Function(Map<String, dynamic> data) onChange,
  ) {
    _controller.addEventListener(event, onChange);
  }

  dynamic getNodeValue(String nodeId) {
    CoreResponse res = _controller.getNodeValue(nodeId);
    if (!res.success) {
      throw Exception(res.error);
    }

    if (res.data!["value"] != null && res.data!["value"].toString().isEmpty) {
      return null;
    }

    return res.data!["value"];
  }

  CoreResponse validateNode(String nodeId, dynamic value) {
    var node = _graph?.nodes['inputs']?[nodeId];

    if (node?.fieldType == FieldType.addressDropdown) {
      if (value is Map) {
        value = value["key"];
      }
      return validateAddressNode(nodeId, value);
    }

    return _controller.validateNode(nodeId, value?.toString());
  }

  // A "Pure" check for the validator that DOES NOT notify listeners
  CoreResponse validateAddressNodeSilently(String nodeId, String? value) {
    CoreResponse res = _controller.validateAddressNode(nodeId, value);
    return res;
  }

  // The "Active" update for User Interaction
  CoreResponse validateAddressNode(String nodeId, String value) {
    final res = _controller.validateAddressNode(nodeId, value);

    if (res.success) {
      _addressNodeIdsToUpdate = res.data?["nodeIds"].cast<String>();
      pulse++;
      notifyListeners();
    }

    return res;
  }

  Map<String, dynamic> validatePage(String pageId) {
    CoreResponse res = _controller.getPageFormValue(pageId);
    if (!res.success || res.data == null) {
      throw Exception(res.error);
    }
    Map<String, dynamic> resultJson = jsonDecode(res.data?["result"]);
    return resultJson;
  }

  void loadForm(Map<String, dynamic> formValue) {
    formValue.forEach((key, value) {
      var nodeId = _fieldNameToNodeId[key];
      if (nodeId == null) {
        throw Exception("Node ID not found for field name [$key]");
      }

      validateNode(nodeId, value);
    });
  }

  Map<String, dynamic> getCurrentFormValue() {
    CoreResponse res = _controller.getCurrentFormValue();
    if (!res.success || res.data == null) {
      throw Exception(res.error);
    }
    Map<String, dynamic> resultJson = jsonDecode(res.data?["result"]);
    return resultJson;
  }

  Map<String, dynamic> submitForm() {
    CoreResponse res = _controller.getFormValue();
    if (!res.success || res.data == null) {
      throw Exception(res.error);
    }
    Map<String, dynamic> resultJson = jsonDecode(res.data?["result"]);
    return resultJson;
  }

  AxonFormNode? getChildNode(String nodeId) {
    CoreResponse res = _controller.getChildNode(nodeId);

    if (!res.success || res.data?["node"] == null) {
      return null;
    }

    return AxonFormNode.fromJson(res.data!["node"]);
  }

  List<AxonFormNode> getOptions(String nodeId) {
    CoreResponse res = _controller.getOptionNodes(nodeId);
    if (!res.success || res.data?["options"] == null) {
      return [];
    }

    List<AxonFormNode> nodes = (res.data!["options"] as List<dynamic>)
        .map((node) => AxonFormNode.fromJson(node))
        .toList();

    nodes.sort((a, b) => a.order.compareTo(b.order));

    return nodes;
  }

  void navigateToPage(String pageId) {
    final targetIndex = _pageIds.indexWhere((id) => id == pageId);
    if (targetIndex == -1) return;

    final pagesToValidate = _pageIds.sublist(0, targetIndex);
    // Defaults to the requested page - only overridden below if an earlier
    // page fails validation, in which case we stop there instead.
    var landingIndex = targetIndex;

    for (final (index, id) in pagesToValidate.indexed) {
      try {
        validatePage(id);
        _invalidPageIds.remove(id);
      } catch (_) {
        _invalidPageIds.add(id);
        landingIndex = index;
        break;
      }
    }

    _currentPageIndex = landingIndex;
    notifyListeners();
  }

  void prevPage() {
    if (_currentPageIndex == 0) {
      return;
    }
    _currentPageIndex -= 1;
    notifyListeners();
  }

  void nextPage() {
    if (_currentPageIndex == _pageCount - 1) {
      return;
    }

    validatePage(_pageIds[_currentPageIndex]);
    _currentPageIndex += 1;

    notifyListeners();
  }
}
