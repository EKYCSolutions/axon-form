
export 'src/core/axon_form_core.dart';

export 'src/base_inputs/base_input.dart';
export 'src/extensions/extension.dart';
export 'src/models/model.dart';
export 'src/shared_widgets.dart/shared_widget.dart';
export 'src/forms/form_builder.dart';

import 'axon_form_flutter_platform_interface.dart';

class AxonFormFlutter {
  Future<String?> getPlatformVersion() {
    return AxonFormFlutterPlatform.instance.getPlatformVersion();
  }
}
