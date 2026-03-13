import 'axon_form_flutter_platform_interface.dart';

export 'src/core/axon_form_core.dart';

/// Backward-compatible plugin facade used by generated integration tests.
class AxonFormFlutter {
  Future<String?> getPlatformVersion() {
    return AxonFormFlutterPlatform.instance.getPlatformVersion();
  }
}
