import 'package:axon_form_flutter/src/core/models/core_response.dart';
import 'package:flutter/foundation.dart';

/// Platform-agnostic surface over the native graph engine. Implemented by
/// [AxonFormFFI] (native platforms, via dart:ffi) and `AxonFormWasm` (web,
/// via a WebAssembly build of the same Go core), selected at compile time
/// through conditional export in `axon_form_engine_factory.dart`.
///
/// Named `AxonFormEngine` (not `AxonFormController`) to avoid colliding with
/// the public-facing `AxonFormController` in `axon_form_controller.dart`,
/// which wraps [AxonFormProvider] for widget consumers.
abstract class AxonFormEngine {
  Future<CoreResponse> initialize(Uint8List fileBytes);

  void addEventListener(
    String eventName,
    void Function(Map<String, dynamic>) callback,
  );

  CoreResponse isNodeVisible(String nodeId);

  CoreResponse getNodeValue(String nodeId);

  CoreResponse validateNode(String nodeId, String? value);

  CoreResponse validateAddressNode(String nodeId, String? value);

  CoreResponse getCurrentFormValue();

  CoreResponse getFormValue();

  CoreResponse getOptionNodes(String nodeId);

  CoreResponse getChildNode(String nodeId);

  CoreResponse getPageFormValue(String pageId);
}
