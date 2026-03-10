import 'package:axon_form_flutter/axon_form_flutter_method_channel.dart';
import 'package:axon_form_flutter/axon_form_flutter_platform_interface.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:plugin_platform_interface/plugin_platform_interface.dart';

class MockAxonFormFlutterPlatform
    with MockPlatformInterfaceMixin
    implements AxonFormFlutterPlatform {
  @override
  Future<String?> getPlatformVersion() => Future.value('42');
}

void main() {
  final AxonFormFlutterPlatform initialPlatform =
      AxonFormFlutterPlatform.instance;

  test('$MethodChannelAxonFormFlutter is the default instance', () {
    expect(initialPlatform, isInstanceOf<MethodChannelAxonFormFlutter>());
  });
}
