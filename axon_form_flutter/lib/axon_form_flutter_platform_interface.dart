import 'package:plugin_platform_interface/plugin_platform_interface.dart';

import 'axon_form_flutter_method_channel.dart';

abstract class AxonFormFlutterPlatform extends PlatformInterface {
  /// Constructs a AxonFormFlutterPlatform.
  AxonFormFlutterPlatform() : super(token: _token);

  static final Object _token = Object();

  static AxonFormFlutterPlatform _instance = MethodChannelAxonFormFlutter();

  /// The default instance of [AxonFormFlutterPlatform] to use.
  ///
  /// Defaults to [MethodChannelAxonFormFlutter].
  static AxonFormFlutterPlatform get instance => _instance;

  /// Platform-specific implementations should set this with their own
  /// platform-specific class that extends [AxonFormFlutterPlatform] when
  /// they register themselves.
  static set instance(AxonFormFlutterPlatform instance) {
    PlatformInterface.verifyToken(instance, _token);
    _instance = instance;
  }

  Future<String?> getPlatformVersion() {
    throw UnimplementedError('platformVersion() has not been implemented.');
  }
}
