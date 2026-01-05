import 'package:axon_form_flutter/src/core/axon_form_ffi.dart';
import 'package:axon_form_flutter/src/models/models.dart';
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

  Future<void> initializeAddress(String filePath) async {
    try {
      final ByteData file = await rootBundle.load(filePath);
      final Uint8List fileBytes = file.buffer.asUint8List();
      coreFFI.initializeAddress(fileBytes);
    } catch (error) {
      rethrow;
    }
  }

  //
  bool isNodeVisible(String nodeId) {
    try {
      CoreResponse response = coreFFI.isNodeVisible(nodeId);
      if (!response.success) {
        throw Exception(response.error);
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  //
  Map<String, dynamic> validateField(String nodeId, String value) {
    try {
      CoreResponse response = coreFFI.validateNode(nodeId, value);
      if (!response.success) {
        throw Exception(response.error);
      }

      return response.data!;
    } catch (error) {
      rethrow;
    }
  }

  Map<String, dynamic> validateAddressField(String nodeId, String value) {
    try {
      CoreResponse response = coreFFI.validateAddressNode(nodeId, value);
      if (!response.success) {
        throw Exception(response.error);
      }
      return response.data!;
    } catch (error) {
      rethrow;
    }
  }

  Map<String, dynamic> getOptionNodes(String nodeId) {
    try {
      CoreResponse response = coreFFI.getOptionNodes(nodeId);
      if (!response.success) {
        throw Exception(response.error);
      }
      return response.data!;
    } catch (error) {
      rethrow;
    }
  }

  Map<String, dynamic> getChildNode(String nodeId) {
    try {
      CoreResponse response = coreFFI.getChildNode(nodeId);
      if (!response.success) {
        throw Exception(response.error);
      }
      return response.data!;
    } catch (error) {
      rethrow;
    }
  }

  //
  Map<String, dynamic> getFormValue() {
    try {
      CoreResponse response = coreFFI.getFormValue();
      if (!response.success) {
        throw Exception(response.error);
      }
      return response.data!;
    } catch (error) {
      rethrow;
    }
  }

  //
  Map<String, dynamic> getPageFormValue(String pageId) {
    try {
      CoreResponse response = coreFFI.getPageFormValue(pageId);
      if (!response.success) {
        throw Exception(response.error);
      }
      return response.data!;
    } catch (error) {
      rethrow;
    }
  }
}
