import 'axon_form_flutter_platform_interface.dart';

export 'src/config/form_builders.dart';
export 'src/config/form_theme.dart';
export 'src/core/axon_form_wrapper.dart';
export 'src/dynamic_form.dart';
export 'src/extensions/extension.dart';
export 'src/models/field_type.dart';
export 'src/models/form_config.dart';
export 'src/models/models.dart';
export 'src/shared_widgets.dart/shared_widget.dart';
export 'src/state/form_state_notifier.dart';

class AxonFormFlutter {
  Future<String?> getPlatformVersion() {
    return AxonFormFlutterPlatform.instance.getPlatformVersion();
  }
}
