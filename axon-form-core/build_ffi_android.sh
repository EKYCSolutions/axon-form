#!/bin/bash
set -e

# -------------------------
# Config
# -------------------------
LIB_NAME=axonlib                   # Name of the library
OUTPUT_DIR=android        # Output folder for reusable library
JNI_DIR=$OUTPUT_DIR/jniLibs
NDK_VERSION=27.0.12077973
ANDROID_SDK="$HOME/Library/Android/sdk"
NDK_BIN="$HOME/Library/Android/sdk/ndk/27.0.12077973/toolchains/llvm/prebuilt/darwin-x86_64/bin"
API=21                            # Android API level

echo "🧹 Cleaning old build files..."
rm -rf $OUTPUT_DIR
mkdir -p $JNI_DIR

# -------------------------
# Build function
# -------------------------
build_lib() {
  local goarch=$1
  local abi=$2
  local target=$3

  echo "⚙️ Building for $abi (GOARCH=$goarch, target=$target)..."
  mkdir -p $JNI_DIR/$abi

  CGO_ENABLED=1 \
  GOOS=android \
  GOARCH=$goarch \
  CC="$NDK_BIN/clang --target=$target" \
  go build -buildmode=c-shared -o $JNI_DIR/$abi/$LIB_NAME.so .
}

# -------------------------
# Build for Android ABIs
# -------------------------
build_lib arm64 arm64-v8a aarch64-linux-android$API
build_lib arm armeabi-v7a armv7a-linux-androideabi$API
build_lib amd64 x86_64 x86_64-linux-android$API
build_lib 386 x86 i686-linux-android$API

echo "✅ Build finished!"
echo "📂 Output folder: $OUTPUT_DIR/jniLibs"
