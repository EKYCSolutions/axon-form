Pod::Spec.new do |s|
  s.name             = 'axon_form_flutter'
  s.version          = '0.0.1'
  s.summary          = 'A Flutter plugin using FFI'
  s.description      = 'Links to native C library for iOS'
  s.homepage         = 'https://ekycsolutions.com'
  s.license          = { :type => 'MIT' }
  s.author           = { 'You' => 'you@example.com' }
  s.source           = { :path => '.' }

  s.platform     = :ios, '11.0'

  s.vendored_libraries = 'libaxon.a'  
  s.public_header_files = 'libaxon.h'

  s.pod_target_xcconfig = {
    'OTHER_LDFLAGS' => '-force_load $(PODS_TARGET_SRCROOT)/axon_form_flutter/ios/libaxon.a -lstdc++'
  }
end
