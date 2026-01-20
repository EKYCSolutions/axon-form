import 'dart:convert';

import 'package:axon_form_flutter/src/core/axon_form_ffi.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:axon_form_flutter/src/core/models/graph.dart';
import 'package:axon_form_flutter/src/core/models/node.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

class AxonFormProvider extends ChangeNotifier {
  final AxonFormFFI _controller = AxonFormFFI();

  AxonFormGraph? _graph;
  AxonFormGraph? get graph => _graph;

  bool _isLoading = true;
  bool get isLoading => _isLoading;

  /*
    Address Inputs variables
  */
  List<String>? _addressNodeIdsToUpdate;
  List<String>? get addressNodeIdsToUpdate => _addressNodeIdsToUpdate;
  //
  int pulse = 0;

  AxonFormProvider(String filePath) {
    initialize(filePath);
  }

  Future<void> initialize(String filePath) async {
    final ByteData file = await rootBundle.load(filePath);
    final Uint8List fileBytes = file.buffer.asUint8List();
    //
    CoreResponse result = _controller.initialize(fileBytes);
    //
    if (!result.success || result.data == null) {
      throw Exception(result.error);
    }
    //
    _graph = AxonFormGraph.fromJson(result.data!);
    _isLoading = false;

    addEventListener('onNodeValidatedChanged', (data) {});
    notifyListeners();
  }

  @override
  void dispose() {
    print("dispose");
    super.dispose();
  }

  void addEventListener(
    String event,
    void Function(Map<String, dynamic> data) onChange,
  ) {
    _controller.addEventListener(event, onChange);
  }

  CoreResponse validateNode(String nodeId, dynamic value) {
    CoreResponse res = _controller.validateNode(nodeId, value);
    return res;
  }

  // A "Pure" check for the validator that DOES NOT notify listeners
  String? validateAddressNodeSilently(String nodeId, String? value) {
    print("[silent: $nodeId] received: $nodeId | value $value");
    final res = _controller.validateAddressNode(nodeId, value);
    print("res ${res.data} | ${res.error}");
    return res.error;
  }

  // The "Active" update for User Interaction
  void validateAddressNode(String nodeId, String value) {
    final res = _controller.validateAddressNode(nodeId, value);
    print("res ${res.data} ${res.error}");
    if (res.success) {
      _addressNodeIdsToUpdate = res.data?["nodeIds"].cast<String>();
      pulse++;
      notifyListeners();
    }
  }

  // CoreResponse validateAddressNode(String nodeId, String value) {
  //   CoreResponse res = _controller.validateAddressNode(nodeId, value);

  //   if (res.success) {
  //     _addressNodeIdsToUpdate = res.data?["nodeIds"].cast<String>();
  //     _addressError = res.error;
  //     pulse++;
  //     notifyListeners();
  //   }

  //   return res;
  // }

  Map<String, dynamic> submitForm() {
    CoreResponse res = _controller.getFormValue();
    if (!res.success || res.data == null) {
      // throw Exception(res.error);
      print("Submit form error: ${res.error}");
      return {};
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

    return nodes;
  }
}
