import 'package:ekyc_id_flutter/ekyc_id_flutter.dart';


class DetectionServices {
  DetectionServices._();

  static final DetectionServices instance = DetectionServices._();

  late final DocumentDetection documentDetection;
  late final FaceDetection faceDetection;
  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;

    documentDetection = DocumentDetection();
    faceDetection = FaceDetection();

    await documentDetection.initialize();
    await documentDetection.setWhiteList([
      ObjectDetectionObjectType.NATIONAL_ID_0,
      ObjectDetectionObjectType.PASSPORT_KH_0,
    ]);
    await faceDetection.initialize();

    _initialized = true;
  }
}
