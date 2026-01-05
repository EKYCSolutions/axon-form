import 'dart:ffi';
import 'package:ffi/ffi.dart';

typedef InitGraphC = Int32 Function(Pointer<Void> dataPtr, Int32 dataLen);
typedef InitGraphDart = int Function(Pointer<Void> dataPtr, int dataLen);

typedef InitAddressC = Int32 Function(Pointer<Void> dataPtr, Int32 dataLen);
typedef InitAddressDart = int Function(Pointer<Void> dataPtr, int dataLen);

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

typedef ValidateAddressNodeC =
    Int32 Function(
      Pointer<Void> nodeIdPtr,
      Int32 nodeIdLen,
      Pointer<Void> valuePtr,
      Int32 valueLen,
    );
typedef ValidateAddressNodeDart =
    int Function(
      Pointer<Void> nodeIdPtr,
      int nodeIdLen,
      Pointer<Void> valuePtr,
      int valueLen,
    );

typedef GetResultC = Pointer<Utf8> Function();
typedef GetResultDart = Pointer<Utf8> Function();

typedef GetChildNodeC =
    Pointer<Utf8> Function(Pointer<Void> nodeIdPtr, Int32 nodeIdLen);
typedef GetChildNodeDart =
    Pointer<Utf8> Function(Pointer<Void> nodeIdPtr, int nodeIdLen);

typedef GetOptionNodesC =
    Pointer<Utf8> Function(Pointer<Void> nodeIdPtr, Int32 nodeIdLen);
typedef GetOptionNodesDart =
    Pointer<Utf8> Function(Pointer<Void> nodeIdPtr, int nodeIdLen);

typedef GetFormValueC = Int32 Function();
typedef GetFormValueDart = int Function();

typedef GetPageFormValueC =
    Int32 Function(Pointer<Void> nodeIdPtr, Int32 nodeIdLen);
typedef GetPageFormValueDart =
    int Function(Pointer<Void> nodeIdPtr, int nodeIdLen);
