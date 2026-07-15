import 'dart:async';
import 'dart:convert';
import 'dart:js_interop';

import 'package:axon_form_flutter/src/core/controller/axon_form_engine.dart';
import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:web/web.dart' as web;

/// Package-relative asset key (as declared in pubspec.yaml `flutter:
/// assets:`), used to fetch the wasm binary via [rootBundle].
const _wasmBinaryAssetKey = 'packages/axon_form_flutter/web/axonlib.wasm';

/// The same asset, but as an HTTP path a `<script>` tag can fetch directly.
/// Flutter web serves package assets under `assets/packages/<pkg>/<path>`.
const _wasmExecScriptSrc =
    'assets/packages/axon_form_flutter/web/wasm_exec.js';

@JS('Go')
extension type _Go._(JSObject _) implements JSObject {
  external _Go();
  external JSObject importObject;
  external JSPromise<JSAny?> run(JSObject instance);
}

extension type _WasmInstantiateResult._(JSObject _) implements JSObject {
  external JSObject get instance;
}

@JS('WebAssembly.instantiate')
external JSPromise<_WasmInstantiateResult> _wasmInstantiate(
  JSUint8Array bytes,
  JSObject importObject,
);

@JS('AxonForm')
external JSObject? get _axonForm;

@JS('Go')
external JSObject? get _goClass;

@JS('AxonForm.initGraph')
external JSString _initGraph(JSUint8Array data);

@JS('AxonForm.addEventListener')
external JSString _addEventListener(JSString event, JSFunction callback);

@JS('AxonForm.isNodeVisible')
external JSString _isNodeVisible(JSString nodeId);

@JS('AxonForm.getNodeValue')
external JSString _getNodeValue(JSString nodeId);

@JS('AxonForm.validateNode')
external JSString _validateNode(JSString nodeId, JSString value);

@JS('AxonForm.validateAddressNode')
external JSString _validateAddressNode(JSString nodeId, JSString value);

@JS('AxonForm.getChildNode')
external JSString _getChildNode(JSString nodeId);

@JS('AxonForm.getOptionNodes')
external JSString _getOptionNodes(JSString nodeId);

@JS('AxonForm.getFormValue')
external JSString _getFormValue(JSBoolean ignoreErrors);

@JS('AxonForm.getPageFormValue')
external JSString _getPageFormValue(JSString pageId);

/// Web implementation of [AxonFormEngine], backed by a WebAssembly
/// build of the same Go graph engine used natively (see
/// axon-form-core/wasm_wrapper.go). The wasm binary and its `wasm_exec.js`
/// loader ship as package assets (see pubspec.yaml `flutter: assets:`) and
/// are fetched and instantiated by [_ensureLoaded] the first time a form is
/// created, so consumers don't need to copy any files into their own
/// `web/index.html` (mirrors how the Android/iOS native libs are bundled).
class AxonFormWasm implements AxonFormEngine {
  static const _readyPollInterval = Duration(milliseconds: 20);
  static const _readyTimeout = Duration(seconds: 15);

  // Shared across instances so the module is only ever fetched/instantiated
  // once per page, even if multiple forms are created.
  static Future<void>? _loadFuture;

  Future<void> _ensureLoaded() => _loadFuture ??= _loadWasmModule();

  Future<void> _loadWasmModule() async {
    await _loadWasmExecScript();

    final wasmBytes = (await rootBundle.load(
      _wasmBinaryAssetKey,
    )).buffer.asUint8List();

    final go = _Go();
    final result = await _wasmInstantiate(wasmBytes.toJS, go.importObject)
        .toDart;

    // Go programs built for wasm typically block forever (e.g. `select{}`)
    // to keep their exports alive, so this future never resolves under
    // normal operation - it must not be awaited.
    unawaited(go.run(result.instance).toDart);
  }

  Future<void> _loadWasmExecScript() async {
    if (_goClass != null) return;

    final completer = Completer<void>();
    final script = web.HTMLScriptElement()..src = _wasmExecScriptSrc;

    void onLoad(JSAny _) => completer.complete();
    void onError(JSAny _) => completer.completeError(
      Exception('Failed to load wasm_exec.js from $_wasmExecScriptSrc'),
    );

    script.addEventListener('load', onLoad.toJS);
    script.addEventListener('error', onError.toJS);
    web.document.head!.appendChild(script);
    await completer.future;
  }

  Future<void> _waitUntilReady() async {
    await _ensureLoaded();

    if (_axonForm != null) return;

    final deadline = DateTime.now().add(_readyTimeout);
    while (_axonForm == null) {
      if (DateTime.now().isAfter(deadline)) {
        throw Exception(
          'Timed out waiting for the AxonForm wasm module to load.',
        );
      }
      await Future.delayed(_readyPollInterval);
    }
  }

  CoreResponse _parse(String jsonString) {
    try {
      final decoded = jsonDecode(jsonString);
      if (decoded is List) {
        return CoreResponse(
          decoded.isNotEmpty ? decoded[0] : false,
          decoded.length > 1 ? decoded[1] : null,
          decoded.length > 2 ? decoded[2] : null,
        );
      }
      return CoreResponse(false, 'Invalid JSON format', null);
    } catch (e) {
      return CoreResponse(false, 'Parse error: $e', null);
    }
  }

  @override
  Future<CoreResponse> initialize(Uint8List fileBytes) async {
    await _waitUntilReady();
    final result = _initGraph(fileBytes.toJS);
    return _parse(result.toDart);
  }

  @override
  void addEventListener(
    String eventName,
    void Function(Map<String, dynamic>) callback,
  ) {
    void onEvent(JSString data) {
      try {
        final decoded = jsonDecode(data.toDart);
        if (decoded is Map<String, dynamic>) {
          callback(decoded);
        } else {
          debugPrint('Callback received non-map JSON: $decoded');
        }
      } catch (e) {
        debugPrint('Failed to decode callback JSON: $e');
      }
    }

    _addEventListener(eventName.toJS, onEvent.toJS);
  }

  @override
  CoreResponse isNodeVisible(String nodeId) {
    return _parse(_isNodeVisible(nodeId.toJS).toDart);
  }

  @override
  CoreResponse getNodeValue(String nodeId) {
    return _parse(_getNodeValue(nodeId.toJS).toDart);
  }

  @override
  CoreResponse validateNode(String nodeId, String? value) {
    return _parse(_validateNode(nodeId.toJS, (value ?? '').toJS).toDart);
  }

  @override
  CoreResponse validateAddressNode(String nodeId, String? value) {
    return _parse(_validateAddressNode(nodeId.toJS, (value ?? '').toJS).toDart);
  }

  @override
  CoreResponse getCurrentFormValue() {
    return _parse(_getFormValue(true.toJS).toDart);
  }

  @override
  CoreResponse getFormValue() {
    return _parse(_getFormValue(false.toJS).toDart);
  }

  @override
  CoreResponse getOptionNodes(String nodeId) {
    return _parse(_getOptionNodes(nodeId.toJS).toDart);
  }

  @override
  CoreResponse getChildNode(String nodeId) {
    return _parse(_getChildNode(nodeId.toJS).toDart);
  }

  @override
  CoreResponse getPageFormValue(String pageId) {
    return _parse(_getPageFormValue(pageId.toJS).toDart);
  }
}
