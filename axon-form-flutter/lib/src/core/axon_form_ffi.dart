import 'dart:convert';
import 'dart:ffi';
import 'dart:io';
import 'dart:typed_data';
import 'package:ffi/ffi.dart';

typedef InitGraphC = Int32 Function(Pointer<Void> dataPtr, Int32 dataLen);
typedef InitGraphDart = int Function(Pointer<Void> dataPtr, int dataLen);

typedef IsNodeVisibleC =
    Int32 Function(Pointer<Void> nodeIdPtr, Int32 nodeIdLen);
typedef IsNodeVisibleDart =
    int Function(Pointer<Void> nodeIdPtr, int nodeIdLen);

typedef ValidateNodeC =
    Int32 Function(
      Pointer<Void> nodeIdPtr,
      Int32 nodeIdLen,
      Pointer<Void> valuePtr,
      Int32 valueLen,
    );
typedef ValidateNodeDart =
    int Function(
      Pointer<Void> nodeIdPtr,
      int nodeIdLen,
      Pointer<Void> valuePtr,
      int valueLen,
    );

typedef GetResultC = Pointer<Utf8> Function();
typedef GetResultDart = Pointer<Utf8> Function();

typedef GetFormValueC = Int32 Function();
typedef GetFormValueDart = int Function();

class AxonFormFFI {
  late final DynamicLibrary _dylib;
  late final InitGraphDart _initGraphDart;
  late final IsNodeVisibleDart _isNodeVisibleDart;
  late final ValidateNodeDart _validateNodeDart;
  late final GetResultDart _getResult;
  late final GetFormValueDart _getFormValueDart;

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

      _isNodeVisibleDart = _dylib
          .lookup<NativeFunction<IsNodeVisibleC>>('IsNodeVisible')
          .asFunction();

      _validateNodeDart = _dylib
          .lookup<NativeFunction<ValidateNodeC>>('ValidateNode')
          .asFunction();

      _getResult = _dylib
          .lookup<NativeFunction<GetResultC>>('GetResult')
          .asFunction();

      _getFormValueDart = _dylib
          .lookup<NativeFunction<GetFormValueC>>('GetFormValue')
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
  bool isNodeVisible(String nodeId) {
    final nodeIdBytes = nodeId.toNativeUtf8();

    // Call native function
    _isNodeVisibleDart(nodeIdBytes.cast<Void>(), nodeId.length);

    //
    malloc.free(nodeIdBytes);

    final ptr = _getResult();
    final jsonString = ptr.toDartString();

    final decoded = jsonDecode(jsonString);
    return decoded[0];
  }

  //
  Map<String, dynamic> validateNode(String nodeId, String value) {
    final nodeIdBytes = nodeId.toNativeUtf8();
    final valueBytes = value.toNativeUtf8();

    // Call native function
    _validateNodeDart(
      nodeIdBytes.cast<Void>(),
      nodeId.length,
      valueBytes.cast<Void>(),
      value.length,
    );

    //
    malloc.free(nodeIdBytes);
    malloc.free(valueBytes);

    final ptr = _getResult();
    final jsonString = ptr.toDartString();

    final decoded = jsonDecode(jsonString);
    Map<String, dynamic> result = {
      "status": decoded[0],
      "errorMessages": decoded[1],
    };

    return result;
  }

  //
  Map<String, dynamic> getFormValue() {
    _getFormValueDart();

    final ptr = _getResult();
    final jsonString = ptr.toDartString();

    final result = jsonDecode(jsonString);

    return result;
  }
}
