Pod::Spec.new do |s|
  s.name             = 'axon_form_flutter'
  s.version          = '0.0.1'
  s.summary          = 'A Flutter plugin using FFI'
  s.description      = 'Links to native C library for iOS'
  s.homepage         = 'https://ekycsolutions.com'
  s.license          = { :type => 'MIT' }
  s.author           = { 'You' => 'you@example.com' }
  s.source           = { :path => '.' }

  # s.platform     = :ios, '11.0'
  # s.vendored_libraries = 'libaxon.a'  
  # s.public_header_files = 'libaxon.h'

  # s.pod_target_xcconfig = {
  #   'OTHER_LDFLAGS' => '-force_load $(PODS_TARGET_SRCROOT)/axon_form_flutter/ios/libaxon.a -lstdc++'
  # }
   # This will ensure the source files in Classes/ are included in the native
  # builds of apps using this FFI plugin. Podspec does not support relative
  # paths, so Classes contains a forwarder C file that relatively imports
  # `../src/*` so that the C sources can be shared among all target platforms.
  s.source_files = 'Classes/**/*'
  s.public_header_files = 'Classes/**/*.h'
  s.vendored_frameworks = 'libsum.xcframework'

  s.dependency 'Flutter'
  s.platform = :ios, '11.0'

  # Flutter.framework does not contain a i386 slice.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386' }
  s.swift_version = '5.0'
end
