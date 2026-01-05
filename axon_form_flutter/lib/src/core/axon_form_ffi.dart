import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:typed_data';
import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:axon_form_flutter/src/core/ffi_types.dart';
import 'package:ffi/ffi.dart';

class AxonFormFFI {
  late final DynamicLibrary _dylib;
  late final InitGraphDart _initGraphDart;
  late final InitAddressDart _initAddressDart;
  late final IsNodeVisibleDart _isNodeVisibleDart;
  late final ValidateNodeDart _validateNodeDart;
  late final ValidateAddressNodeDart _validateAddressNodeDart;
  late final GetChildNodeDart _getChildNodeDart;
  late final GetOptionNodesDart _getOptionNodesDart;
  late final GetResultDart _getResultDart;
  late final GetFormValueDart _getFormValueDart;
  late final GetPageFormValueDart _getPageFormValueDart;

  AxonFormFFI() {
    _loadLibrary();
    _bindFunctions();
  }

  void _loadLibrary() async {
    try {
      _dylib = Platform.isAndroid
          ? DynamicLibrary.open("axonlib.so")
          : DynamicLibrary.process();
    } catch (e) {
      throw Exception('Failed to load library: $e');
    }
  }

  void _bindFunctions() {
    try {
      _initGraphDart = _dylib
          .lookup<NativeFunction<InitGraphC>>('InitGraph')
          .asFunction();

      _initAddressDart = _dylib
          .lookup<NativeFunction<InitAddressC>>('InitAddress')
          .asFunction();

      _isNodeVisibleDart = _dylib
          .lookup<NativeFunction<IsNodeVisibleC>>('IsNodeVisible')
          .asFunction();

      _validateNodeDart = _dylib
          .lookup<NativeFunction<ValidateNodeC>>('ValidateNode')
          .asFunction();

      _validateAddressNodeDart = _dylib
          .lookup<NativeFunction<ValidateNodeC>>('ValidateAddressNode')
          .asFunction();

      _getChildNodeDart = _dylib
          .lookup<NativeFunction<GetChildNodeC>>('GetChildNode')
          .asFunction();

      _getOptionNodesDart = _dylib
          .lookup<NativeFunction<GetOptionNodesC>>('GetOptionNodes')
          .asFunction();

      _getResultDart = _dylib
          .lookup<NativeFunction<GetResultC>>('GetResult')
          .asFunction();

      _getFormValueDart = _dylib
          .lookup<NativeFunction<GetFormValueC>>('GetFormValue')
          .asFunction();

      _getPageFormValueDart = _dylib
          .lookup<NativeFunction<GetPageFormValueC>>('GetPageFormValue')
          .asFunction();
    } catch (e) {
      throw Exception('Failed to bind functions: $e');
    }
  }

  //
  void initialize(Uint8List fileBytes) {
    final Pointer<Uint8> nativeData = malloc<Uint8>(fileBytes.length);
    final nativeBytes = nativeData.asTypedList(fileBytes.length);
    nativeBytes.setAll(0, fileBytes);
    _initGraphDart(nativeData.cast<Void>(), fileBytes.length);
    malloc.free(nativeData);
  }

  //
  void initializeAddress(Uint8List fileBytes) {
    final Pointer<Uint8> nativeData = malloc<Uint8>(fileBytes.length);
    final nativeBytes = nativeData.asTypedList(fileBytes.length);
    nativeBytes.setAll(0, fileBytes);
    _initAddressDart(nativeData.cast<Void>(), fileBytes.length);
    malloc.free(nativeData);
  }

  CoreResponse isNodeVisible(String nodeId) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();

    try {
      _isNodeVisibleDart(nodeIdPtr.cast<Void>(), nodeIdPtr.length);
      return _getCoreResponse();
    } catch (e) {
      print("[isNodeVisible] Error : $e");
    } finally {
      malloc.free(nodeIdPtr);
    }
    return CoreResponse(false, null, null);
  }

  //
  CoreResponse validateNode(String nodeId, String value) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    final Pointer<Utf8> valuePtr = value.toNativeUtf8();

    try {
      _validateNodeDart(
        nodeIdPtr.cast<Void>(),
        nodeIdPtr.length,
        valuePtr.cast<Void>(),
        valuePtr.length,
      );

      return _getCoreResponse();
    } catch (e) {
      print("[validateNode] Error : $e");
      return CoreResponse(false, "[validateNode] Error : $e", null);
    } finally {
      //
      malloc.free(nodeIdPtr);
      malloc.free(valuePtr);
    }
  }

  //
  CoreResponse validateAddressNode(String nodeId, String value) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    final Pointer<Utf8> valuePtr = value.toNativeUtf8();
    //
    try {
      _validateAddressNodeDart(
        nodeIdPtr.cast<Void>(),
        nodeIdPtr.length,
        valuePtr.cast<Void>(),
        valuePtr.length,
      );

      return _getCoreResponse();
    } catch (e) {
      print("[validateAddressNode] Error : $e");
      return CoreResponse(false, "[validateAddressNode] Error : $e", null);
    } finally {
      //
      malloc.free(nodeIdPtr);
      malloc.free(valuePtr);
    }
  }

  //
  CoreResponse getFormValue() {
    try {
      _getFormValueDart();
      return _getCoreResponse();
    } catch (e) {
      print("[getFormValue] Error : $e");
      return CoreResponse(false, "[getFormValue] Error : $e", null);
    }
  }

  //
  CoreResponse getOptionNodes(String nodeId) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    try {
      _getOptionNodesDart(nodeIdPtr.cast<Void>(), nodeIdPtr.length);
      return _getCoreResponse();
    } catch (e) {
      print("[getOptionNodes] Error : $e");
      return CoreResponse(false, "[getOptionNodes] Error : $e", null);
    } finally {
      malloc.free(nodeIdPtr);
    }
  }

  //
  CoreResponse getChildNode(String nodeId) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    try {
      _getChildNodeDart(nodeIdPtr.cast<Void>(), nodeIdPtr.length);
      return _getCoreResponse();
    } catch (e) {
      print("[getChildNode] Error : $e");
      return CoreResponse(false, "[getChildNode] Error : $e", null);
    } finally {
      malloc.free(nodeIdPtr);
    }
  }

  //
  CoreResponse getPageFormValue(String pageId) {
    final pageIdPtr = pageId.toNativeUtf8();
    try {
      _getPageFormValueDart(pageIdPtr.cast<Void>(), pageIdPtr.length);
      return _getCoreResponse();
    } catch (e) {
      print("[getPageFormValue] Error : $e");
      return CoreResponse(false, "[getPageFormValue] Error : $e", null);
    } finally {
      malloc.free(pageIdPtr);
    }
  }

  CoreResponse _getCoreResponse() {
    final Pointer<Utf8> resPtr = _getResultDart();

    if (resPtr == nullptr) {
      return CoreResponse(false, "Native bridge returned null", null);
    }

    try {
      final String jsonString = resPtr.toDartString();

      if (jsonString.isEmpty || jsonString == "null") {
        return CoreResponse(false, "Empty response from Go", null);
      }

      final dynamic decoded = jsonDecode(jsonString);

      if (decoded is List) {
        return CoreResponse(
          decoded.isNotEmpty ? decoded[0] : false, // Result (bool)
          decoded.length > 1 ? decoded[1] : null, // Message (String)
          decoded.length > 2 ? decoded[2] : null, // Data (Object)
        );
      } else {
        print("[getCoreResponse] Unexpected JSON format: $jsonString");
        return CoreResponse(false, "Invalid JSON format", null);
      }
    } catch (e) {
      print("[getCoreResponse] Parsing Error: $e");
      return CoreResponse(false, "Parse error: $e", null);
    } finally {
      // ALWAYS free the pointer to prevent memory leaks
      malloc.free(resPtr);
    }
  }
}
