# build for ios

#!/bin/sh
set -e

LIB_NAME=libaxon
MIN_VERSION=15

# Output directories
BUILD_DIR=build
BUILD_DIR_iphonesimulator=build/iphonesimulator
BUILD_DIR_iphoneos=build/iphoneos
BUILD_DIR_HEADER=build/header
# IOS_DIR=build
IOS_DIR=ios
echo "🧹 Cleaning old build files..."
rm -rf $BUILD_DIR $IOS_DIR
mkdir -p $BUILD_DIR $IOS_DIR $BUILD_DIR_iphonesimulator $BUILD_DIR_iphoneos $BUILD_DIR_HEADER



build_arch() {
  GOARCH=$1
  SDK=$2

  echo "🔨 Building for $GOARCH / $SDK ..."

  export GOOS=ios
  export CGO_ENABLED=1
  export GOARCH=$GOARCH
  export SDK=$SDK

  SDK_PATH=$(xcrun --sdk $SDK --show-sdk-path)

  if [ "$GOARCH" = "amd64" ]; then
    CARCH="x86_64"
  elif [ "$GOARCH" = "arm64" ]; then
    CARCH="arm64"
  fi

  if [ "$SDK" = "iphoneos" ]; then
    TARGET="$CARCH-apple-ios$MIN_VERSION"
  elif [ "$SDK" = "iphonesimulator" ]; then
    TARGET="$CARCH-apple-ios$MIN_VERSION-simulator"
  fi

  CLANG=$(xcrun --sdk $SDK --find clang)
  CC="$CLANG -target $TARGET -isysroot $SDK_PATH"
  export CC

  go build -trimpath -buildmode=c-archive -o $BUILD_DIR/${LIB_NAME}_${GOARCH}_${SDK}.a

  echo "✅ Built $BUILD_DIR/${LIB_NAME}_${GOARCH}_${SDK}.a"
}

# Build three variants
build_arch amd64 iphonesimulator
build_arch arm64 iphonesimulator
build_arch arm64 iphoneos

# Merge simulator slices
echo "📦 Creating universal simulator lib..."
lipo -create \
  $BUILD_DIR/${LIB_NAME}_amd64_iphonesimulator.a \
  $BUILD_DIR/${LIB_NAME}_arm64_iphonesimulator.a \
  -output $BUILD_DIR/iphonesimulator/${LIB_NAME}.a

cp $BUILD_DIR/${LIB_NAME}_arm64_iphoneos.a $BUILD_DIR/iphoneos/${LIB_NAME}.a

# Copy one of the generated headers (all are identical) and rename
HEADER_SRC=$BUILD_DIR/${LIB_NAME}_arm64_iphoneos.h
HEADER_DST=$BUILD_DIR_HEADER/${LIB_NAME}.h
cp $HEADER_SRC $HEADER_DST

# Create xcframework
echo "📦 Creating XCFramework..."
xcodebuild -create-xcframework \
  -library $BUILD_DIR/iphoneos/${LIB_NAME}.a \
  -headers $BUILD_DIR_HEADER \
  -library $BUILD_DIR/iphonesimulator/${LIB_NAME}.a \
  -headers $BUILD_DIR_HEADER \
  -output $IOS_DIR/${LIB_NAME}.xcframework

echo "🧹 Cleaning build files..."
  rm -rf $BUILD_DIR

echo "🎉 Done! XCFramework available at $IOS_DIR/${LIB_NAME}.xcframework"

# END for ios
