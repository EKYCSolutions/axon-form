import 'dart:typed_data';

import 'package:image_picker/image_picker.dart';

Future<Uint8List?> pickImageAsBytes({int? imageQuality = 50}) async {
  final ImagePicker imagePicker = ImagePicker();

  XFile? image = await imagePicker.pickImage(
    source: ImageSource.gallery,
    imageQuality: imageQuality,
    maxWidth: 640,
    maxHeight: 960,
  );
  if (image == null) {
    return null;
  }

  final bytes = await image.readAsBytes();
  return bytes;
}
