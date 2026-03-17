#!/bin/zsh

# 1. Exit immediately if a command exits with a non-zero status
set -e

# 2. Define relative paths for easier maintenance
CORE_DIR="../axon-form-core"
FLUTTER_DIR="../axon_form_flutter"

echo "🚀 Starting Axon Build Process..."

# 3. Build iOS
cd "$CORE_DIR"
echo "🛠 Building FFI for iOS..."
zsh build_ffi_ios.sh

echo "📋 Copying iOS build file to axon_form_flutter..."
# Ensure destination directory exists
mkdir -p "$FLUTTER_DIR/ios/Frameworks"
# Use -a (archive) to preserve attributes and -v for visibility
cp -av ios/libaxon.xcframework "$FLUTTER_DIR/ios/Frameworks"

# 4. Build Android
echo "🛠 Building FFI for Android..."
zsh build_ffi_android.sh

echo "📋 Copying Android build file to axon_form_flutter..."
# Ensure destination directory exists
mkdir -p "$FLUTTER_DIR/android/src/main"
cp -av android/jniLibs "$FLUTTER_DIR/android/src/main"

echo "✅ Build and sync complete!"
