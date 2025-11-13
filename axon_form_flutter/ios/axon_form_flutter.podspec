#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint axon_form_flutter.podspec` to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'axon_form_flutter'
  s.version          = '0.0.1'
  s.summary          = 'A new Flutter plugin project.'
  s.description      = <<-DESC
A new Flutter plugin project.
                       DESC
  s.homepage         = 'http://example.com'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'Your Company' => 'email@example.com' }
  s.source           = { :path => '.' }
  s.source_files = 'Classes/**/*'
  s.dependency 'Flutter'
  # Align minimum iOS target with your app and build scripts
  s.platform = :ios, '15.0'
  s.ios.deployment_target = '15.0'

  # Use a static framework for this plugin (recommended for Flutter pods)
  s.static_framework = true

  # Point to your packaged XCFramework (ensure it is copied under ios/Frameworks/)
  s.vendored_frameworks = 'Frameworks/libaxon.xcframework'

  # Keep symbols from being dead-stripped so FFI can resolve them at runtime.
  # Also link libc++ explicitly (Go c-archive often needs it transitively).
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386',
    'IPHONEOS_DEPLOYMENT_TARGET' => '15.0',
    # Force load all objects from static library and link c++
    'OTHER_LDFLAGS' => '$(inherited) -lc++ -all_load'
  }
  
  # Also apply to user target (Runner app) so symbols are in final binary
  s.user_target_xcconfig = {
    'OTHER_LDFLAGS' => '$(inherited) -lc++ -all_load'
  }

  s.swift_version = '5.0'

  # If your plugin requires a privacy manifest, for example if it uses any
  # required reason APIs, update the PrivacyInfo.xcprivacy file to describe your
  # plugin's privacy impact, and then uncomment this line. For more information,
  # see https://developer.apple.com/documentation/bundleresources/privacy_manifest_files
  # s.resource_bundles = {'axon_form_flutter_privacy' => ['Resources/PrivacyInfo.xcprivacy']}

  
end
