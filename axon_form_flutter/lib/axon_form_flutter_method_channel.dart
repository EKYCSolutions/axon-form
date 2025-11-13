import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

import 'axon_form_flutter_platform_interface.dart';

/// An implementation of [AxonFormFlutterPlatform] that uses method channels.
class MethodChannelAxonFormFlutter extends AxonFormFlutterPlatform {
  /// The method channel used to interact with the native platform.
  @visibleForTesting
  final methodChannel = const MethodChannel('axon_form_flutter');

  @override
  Future<String?> getPlatformVersion() async {
    final version = await methodChannel.invokeMethod<String>('getPlatformVersion');
    return version;
  }
}
