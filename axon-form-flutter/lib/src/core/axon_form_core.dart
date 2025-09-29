import 'package:axon_form_flutter/src/core/axon_form_ffi.dart';
import 'package:flutter/services.dart';

class AxonFormCore {
  var coreFFI = AxonFormFFI();
  //
  Future<void> initialize(String filePath) async {
    try {
      final ByteData file = await rootBundle.load(filePath);
      final Uint8List fileBytes = file.buffer.asUint8List();
      coreFFI.initialize(fileBytes);
    } catch (error) {
      rethrow;
    }
  }

  //
  bool isNodeVisible(String nodeId) {
    try {
      return coreFFI.isNodeVisible(nodeId);
    } catch (error) {
      rethrow;
    }
  }

  //
  Map<String, dynamic> validateField(String nodeId, String value) {
    try {
      return coreFFI.validateNode(nodeId, value);
    } catch (error) {
      rethrow;
    }
  }

  //
  Map<String, dynamic> getFormValue() {
    try {
      return coreFFI.getFormValue();
    } catch (error) {
      rethrow;
    }
  }
}
