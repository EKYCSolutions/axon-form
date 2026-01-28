import 'dart:convert';

import 'package:axon_form_flutter/src/core/axon_form_ffi.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:axon_form_flutter/src/core/models/graph.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';
import 'package:flutter/foundation.dart';

class AxonFormProvider extends ChangeNotifier {
  static final AxonFormFFI _controller = AxonFormFFI();

  bool _isLoading = true;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  AxonFormGraph? _graph;
  AxonFormGraph? get graph => _graph;

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

  AxonFormProvider(Future<Uint8List> Function() loader) {
    initialize(loader);
  }

  Future<void> initialize(Future<Uint8List> Function() loader) async {
    try {
      final jsonBytes = await loader();
      //
      CoreResponse result = _controller.initialize(jsonBytes);
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

        notifyListeners();
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
    CoreResponse res = _controller.validateNode(nodeId, value?.toString());
    return res;
  }

  // A "Pure" check for the validator that DOES NOT notify listeners
  String? validateAddressNodeSilently(String nodeId, String? value) {
    final res = _controller.validateAddressNode(nodeId, value);
    return res.error;
  }

  // The "Active" update for User Interaction
  void validateAddressNode(String nodeId, String value) {
    final res = _controller.validateAddressNode(nodeId, value);

    if (res.success) {
      _addressNodeIdsToUpdate = res.data?["nodeIds"].cast<String>();
      pulse++;
      notifyListeners();
    }
  }

  Map<String, dynamic> validatePage(String pageId) {
    CoreResponse res = _controller.getPageFormValue(pageId);
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
