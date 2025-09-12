Pod::Spec.new do |s|
  s.name             = 'axon_form_flutter'
  s.version          = '0.0.1'
  s.summary          = 'A Flutter plugin using FFI'
  s.description      = 'Links to native C library for iOS'
  s.homepage         = 'https://ekycsolutions.com'
  s.license          = { :type => 'MIT' }
  s.author           = { 'You' => 'you@example.com' }
  s.source           = { :path => '.' }
  s.platform         = :ios, '12.0'

  s.source_files = 'Classes/**/*'
  s.public_header_files = 'Classes/**/*.h'
  s.vendored_frameworks = 'libaxon.xcframework'

  # Flutter.framework does not contain a i386 slice.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386' }
  s.swift_version = '5.0'
end
