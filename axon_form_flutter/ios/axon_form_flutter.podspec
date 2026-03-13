#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint axon_form_flutter.podspec` to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'axon_form_flutter'
  s.version          = '0.0.1'
  s.summary          = 'Cross-platform Flutter plugin for dynamic form rendering.'
  s.description      = <<-DESC
Axon Form Flutter is a cross-platform plugin for building and rendering
dynamic forms with configurable fields, validation, and file uploads.
                       DESC
  s.homepage         = 'https://example.com/axon-form-flutter'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Axon Form Team' => 'support@example.com' }
  s.source           = { :path => '.' }
  s.source_files = 'Classes/**/*'
  s.dependency 'Flutter'
  s.platform = :ios, '15.0'
  s.ios.deployment_target = '15.0'

  s.static_framework = true
  s.vendored_frameworks = 'Frameworks/libaxon.xcframework'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'IPHONEOS_DEPLOYMENT_TARGET' => '15.0',
    # Force load all objects from static library and link c++
    'OTHER_LDFLAGS' => '$(inherited) -lc++ -all_load'
  }
  
  s.user_target_xcconfig = {
    'OTHER_LDFLAGS' => '$(inherited) -lc++ -all_load'
  }

  s.swift_version = '5.0'
  
end
