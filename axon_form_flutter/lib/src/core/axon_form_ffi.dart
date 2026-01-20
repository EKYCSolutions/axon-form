import 'dart:convert';
import 'dart:ffi';
import 'dart:io';

import 'package:axon_form_flutter/src/core/ffi_types.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:ffi/ffi.dart';
import 'package:flutter/foundation.dart';

class AxonFormFFI {
  late final DynamicLibrary _dylib;
  late final InitGraphDart _initGraphDart;
  late final AddEventListenerDart _addEventListenerDart;
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

      _addEventListenerDart = _dylib
          .lookup<NativeFunction<AddEventListenerC>>('AddEventListener')
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
  CoreResponse initialize(Uint8List fileBytes) {
    final Pointer<Uint8> nativeData = malloc<Uint8>(fileBytes.length);
    final nativeBytes = nativeData.asTypedList(fileBytes.length);
    nativeBytes.setAll(0, fileBytes);
    _initGraphDart(nativeData.cast<Void>(), fileBytes.length);
    malloc.free(nativeData);
    return _getCoreResponse("initialize");
  }

  // Keep references to listeners to prevent them from being garbage collected
  final List<NativeCallable> _activeListeners = [];

  //
  void addEventListener(
    String eventName,
    Function(Map<String, dynamic>) callback,
  ) {
    final Pointer<Utf8> eventNamePtr = eventName.toNativeUtf8();

    // Create a native-callable listener. This is thread-safe and can be called from Go/C.
    final listener = NativeCallable<NativeStringCallback>.listener((
      Pointer<Utf8> strPtr,
    ) {
      final str = strPtr.toDartString();
      malloc.free(strPtr);

      try {
        final decoded = jsonDecode(str);
        if (decoded is Map<String, dynamic>) {
          callback(decoded);
        } else {
          debugPrint("Callback received non-map JSON: $decoded");
        }
      } catch (e) {
        debugPrint("Failed to decode callback JSON: $e");
      }
    });

    // Store the listener so it doesn't get garbage collected
    _activeListeners.add(listener);

    _addEventListenerDart(
      eventNamePtr.cast<Void>(),
      eventNamePtr.length,
      listener.nativeFunction, // Pass the actual function pointer
    );

    malloc.free(eventNamePtr);
    _getCoreResponse("addEventListener");
  }

  CoreResponse isNodeVisible(String nodeId) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();

    try {
      _isNodeVisibleDart(nodeIdPtr.cast<Void>(), nodeIdPtr.length);
      return _getCoreResponse("isNodeVisible");
    } catch (e) {
      debugPrint("[isNodeVisible] Error : $e");
    } finally {
      malloc.free(nodeIdPtr);
    }
    return CoreResponse(false, null, null);
  }

  //
  CoreResponse validateNode(String nodeId, String? value) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    Pointer<Utf8> valuePtr = nullptr;
    int valueLen = 0;

    if (value != null) {
      valuePtr = value.toNativeUtf8();
      valueLen = valuePtr.length;
    }

    try {
      _validateNodeDart(
        nodeIdPtr.cast<Void>(),
        nodeIdPtr.length,
        valuePtr.cast<Void>(),
        valueLen,
      );

      return _getCoreResponse("validateNode");
    } catch (e) {
      debugPrint("[validateNode] Error : $e");
      return CoreResponse(false, "[validateNode] Error : $e", null);
    } finally {
      //
      malloc.free(nodeIdPtr);
      if (valuePtr != nullptr) {
        malloc.free(valuePtr);
      }
    }
  }

  //
  CoreResponse validateAddressNode(String nodeId, String? value) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    Pointer<Utf8> valuePtr = nullptr;
    int valueLen = 0;

    if (value != null) {
      valuePtr = value.toNativeUtf8();
      valueLen = valuePtr.length;
    }
    //
    try {
      _validateAddressNodeDart(
        nodeIdPtr.cast<Void>(),
        nodeIdPtr.length,
        valuePtr.cast<Void>(),
        valueLen,
      );

      return _getCoreResponse("validateAddressNode");
    } catch (e) {
      debugPrint("[validateAddressNode] Error : $e");
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
      return _getCoreResponse("getFormValue");
    } catch (e) {
      debugPrint("[getFormValue] Error : $e");
      return CoreResponse(false, "[getFormValue] Error : $e", null);
    }
  }

  //
  CoreResponse getOptionNodes(String nodeId) {
    final Pointer<Utf8> nodeIdPtr = nodeId.toNativeUtf8();
    try {
      _getOptionNodesDart(nodeIdPtr.cast<Void>(), nodeIdPtr.length);
      return _getCoreResponse("getOptionNodes");
    } catch (e) {
      debugPrint("[getOptionNodes] Error : $e");
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
      return _getCoreResponse("getChildNode");
    } catch (e) {
      debugPrint("[getChildNode] Error : $e");
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
      return _getCoreResponse("getPageFormValue");
    } catch (e) {
      debugPrint("[getPageFormValue] Error : $e");
      return CoreResponse(false, "[getPageFormValue] Error : $e", null);
    } finally {
      malloc.free(pageIdPtr);
    }
  }

  CoreResponse _getCoreResponse(String event) {
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
        debugPrint(
          "[getCoreResponse: $event] | Unexpected JSON format: $jsonString",
        );
        return CoreResponse(false, "Invalid JSON format", null);
      }
    } catch (e) {
      debugPrint("[getCoreResponse: $event] | Parsing Error: $e");
      return CoreResponse(false, "Parse error: $e", null);
    } finally {
      // ALWAYS free the pointer to prevent memory leaks
      malloc.free(resPtr);
    }
  }
}
