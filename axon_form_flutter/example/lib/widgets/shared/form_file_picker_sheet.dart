// // ignore_for_file: use_build_context_synchronously

// import 'dart:convert';
// import 'dart:io';

// import 'package:axon_form_flutter_example/provider/detection_services.dart';
// import 'package:collection/collection.dart';
// import 'package:ekyc_id_flutter/ekyc_id_flutter.dart';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

// import 'package:go_router/go_router.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:path/path.dart';





// class _BadgeCheck extends StatelessWidget {
//   const _BadgeCheck();

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       width: 16,
//       height: 16,
//       decoration: BoxDecoration(
//         borderRadius: BorderRadius.circular(50),
//         color: context.successColor,
//         border: Border.all(
//           width: 2,
//           color: context.colorScheme.surface,
//         ),
//       ),
//       child: GdiIcon(
//         icon: "Check",
//         color: context.colorScheme.onPrimary,
//         height: 8,
//         width: 8,
//       ),
//     );
//   }
// }

// class PickerSheet extends StatefulWidget {
//   const PickerSheet({
//     super.key,
//     required this.title,
//     required this.onSelected,
//     required this.name,
//     required this.onOCRResult,
//   });

//   final String title;
//   final String name;

//   final Function(String?) onSelected;
//   final Function(OCRResult) onOCRResult;

//   @override
//   State<PickerSheet> createState() => PickerSheetState();
// }

// class PickerSheetState extends State<PickerSheet> {
//   File? file;

//   final detection =  DetectionServices.instance.documentDetection;

//   @override
//   void initState() {
//     super.initState();

//   }

//   @override
//   void dispose() {
//     super.dispose();
//   }

//   Future<DocumentScannerResult> detectImage(Uint8List image) async {
//     DocumentScannerResult documentScannerResult = await detection.detect(image);
//     return documentScannerResult;
//   }

//   Future<OCRResult> onDoOCR(DocumentScannerResult documentScannerResult) async {
//     OCRResult ocrResult =
//         await EkycIDServices.instance.ocr(document: documentScannerResult);

//     return ocrResult;
//   }

//   void onMyFileSelected(
//     FileEntity selectedFile,
//   ) {
//     if (selectedFile.ocrResult.isNotEmpty) {
//       widget
//           .onOCRResult(OCRResult.fromJson(jsonDecode(selectedFile.ocrResult)));
//     }

//     setState(() {
//       file = File(selectedFile.filePath);
//     });
//   }

//   Future<void> onDocumentScanned(
//     DocumentScannerResult result,
//     MyFilesType fileType,
//     BuildContext context,
//   ) async {
//     await DialogUtil.showAiLoading(context, () async {
//       try {
//         OCRResult ocrResult = await onDoOCR(result);

//         OCRResult verifiedOCRResult = await ref
//             .read(myFilesController.notifier)
//             .verifyOCRResult(ocrResult, result.documentType, context);

//         if (fileType == MyFilesType.NATIONAL_ID) {
//           widget.onOCRResult(verifiedOCRResult);
//         }

//         File? savedFile = await ref.read(myFilesController.notifier).addFile(
//               image: result.documentImage,
//               fileType: fileType,
//               ocrResult: verifiedOCRResult,
//             );

//         setState(() {
//           file = savedFile;
//         });
//       } catch (e) {
//         loge(e: e, msg: "do ocr error");
//          context.pop();
//         await DialogUtil.showErrorDialog(
//           context,
//           content: Texts.b4(context, "មិនអាចទាញយកទិន្នន័យបាន"),
//         );
//       }
//     });
//   }

//   Future<void> onUploadFile(
//     XFile selectedFile,
//     MyFilesType fileType,
//     BuildContext context,
//   ) async {
//     try {
//       await DialogUtil.showAiLoading(context, () async {
//         Uint8List image = await selectedFile.readAsBytes();
//         OCRResult? ocrResult;

//         List<MyFilesType> scannableDocuments = [
//           MyFilesType.NATIONAL_ID,
//           MyFilesType.PASSPORT,
//         ];

//         if (scannableDocuments.contains(fileType)) {
//           DocumentScannerResult? result = await detectImage(image);

//           ocrResult = await onDoOCR(result);
//           ocrResult = await ref
//               .read(myFilesController.notifier)
//               .verifyOCRResult(ocrResult, result.documentType, context);

//           if (fileType == MyFilesType.NATIONAL_ID) {
//             widget.onOCRResult(ocrResult);
//           }
//         }

//         File? savedFile = await ref.read(myFilesController.notifier).addFile(
//               image: image,
//               fileType: fileType,
//               ocrResult: ocrResult,
//             );

//         setState(() {
//           file = savedFile;
//         });
//       });
//     } on PlatformException catch (error) {
//       onDocumentDetectionError(error, context);
//       rethrow;
//     } catch (e) {
//       loge(e: e, msg: "do ocr error");
//     }
//   }

//   void onDocumentDetectionError(
//     PlatformException error,
//     BuildContext context,
//   ) async {
//     final FrameStatus? frameStatus = FrameStatus.values.firstWhereOrNull(
//         (FrameStatus i) => i.toString() == "FrameStatus.${error.message}");

//     if (frameStatus != null) {
//       print("frameStatus !=- null");
//       String errorMsg = ErrorHandler.ocr(frameStatus);
//       await DialogUtil.showErrorDialog(
//         context,
//         content: Texts.b4(context, errorMsg),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     MyFilesType fileType = ref
//         .read(myFilesController.notifier)
//         .convertConfigurationFileTypeToMyFileType(widget.name);

//     List<MyFilesType> scannableDocuments = [
//       MyFilesType.NATIONAL_ID,
//       MyFilesType.PASSPORT,
//     ];
//     bool shouldIncludeDocumentScan = scannableDocuments.contains(fileType);

//     return BaseCard(
//       padding: Constants.containerPadding.copyWith(
//           bottom: MediaQuery.of(context).padding.bottom != 0
//               ? MediaQuery.of(context).padding.bottom
//               : 24),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.stretch,
//         mainAxisAlignment: MainAxisAlignment.start,
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           const SizedBox(height: 20),
//           Row(
//             mainAxisAlignment: shouldIncludeDocumentScan
//                 ? MainAxisAlignment.spaceBetween
//                 : MainAxisAlignment.center,
//             children: <Widget>[
//               SquareButton(
//                 color: ColorUtils.primaryLightColor,
//                 iconName: AssetsUtils.myDocIcon,
//                 title: "ឯកសាររបស់ខ្ញុំ",
//                 onPressed: () async {
//                   FileEntity? selectedFile = await DialogUtil.showBottomSheet(
//                     context: context,
//                     child: SelectFileFromMyFiles(
//                       fileType: fileType,
//                     ),
//                   );
//                   //
//                   if (!context.mounted) {
//                     print("no context");
//                   }
//                   //
//                   if (selectedFile != null && context.mounted) {
//                     onMyFileSelected(selectedFile);
//                     widget.onSelected(file?.path);
//                   }
//                 },
//               ),
//               shouldIncludeDocumentScan
//                   ? SquareButton(
//                       color: ColorUtils.secondaryLightColor,
//                       iconName: AssetsUtils.scanDocIcon,
//                       title: "ស្កេនឯកសារ",
//                       onPressed: () async {
//                         bool cameraGranted = await ref
//                             .read(profileProvider.notifier)
//                             .checkAndRequestCameraPermission(context);

//                         if (!cameraGranted) {
//                           return;
//                         }
//                         DocumentScannerResult? result =
//                             await  context.push(
//                                   "/application/scan_document",
//                                 );

//                         if (result != null) {
//                           await onDocumentScanned(result, fileType, context);
//                           widget.onSelected(file?.path);
//                            context.pop();
//                         }
//                       },
//                     )
//                   : Container(),
//               SquareButton(
//                 color: ColorUtils.neutralLightColor,
//                 iconName: AssetsUtils.importDocIcon,
//                 title: "បញ្ចូលឯកសារ",
//                 onPressed: () async {
//                   bool cameraGranted = await ref
//                       .read(profileProvider.notifier)
//                       .checkAndRequestPhotoPermission(context);
//                   if (!cameraGranted) {
//                     return;
//                   }

//                   XFile? selectedFile =
//                       await ref.read(fileProvider).pickImageAsXFile();

//                   if (!context.mounted) {
//                     print("no context");
//                   }

//                   if (selectedFile != null && context.mounted) {
//                     await onUploadFile(selectedFile, fileType, context);
//                     widget.onSelected(file?.path);
//                      context.pop();
//                   }
//                 },
//               ),
//             ].addBetween(const SizedBox(
//               width: 10,
//             )),
//           ),
//           const SizedBox(height: 20),
//           BaseCard(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.stretch,
//               children: [
//                 const FormSectionHeader(
//                     title: "ឯកសារបានបញ្ចូលរួច",
//                     description: "សូមមេត្តាពិនិត្យមើលឯកសាររបស់លោកអ្នក"),
//                 const SizedBox(height: 20),
//                 if (file != null)
//                   FlashMessage(
//                     content: "ឯកសារត្រូវបានទទួលស្គាល់ដោយជោគជ័យ",
//                     icon: GdiIcon(
//                       icon: "Sparkle_Filled",
//                       color: context.colorScheme.onTertiary,
//                     ),
//                   ),
//                 if (file != null)
//                   Padding(
//                     padding: const EdgeInsets.symmetric(vertical: 24),
//                     child: Row(
//                       children: [
//                         SizedBox(
//                           height: 32,
//                           width: 32,
//                           child: BaseCard(
//                             borderRadius: BorderRadius.circular(10),
//                             padding: const EdgeInsets.all(0),
//                             backgroundColor:
//                                 context.successColor.withOpacity(0.1),
//                             child: Center(
//                               child: GdiIcon(
//                                 color: context.successColor,
//                                 icon: "File_Filled",
//                                 height: 16,
//                                 width: 16,
//                               ),
//                             ),
//                           ),
//                         ),
//                         const SizedBox(width: 8),
//                         Texts.caption(
//                           context,
//                           basename(file!.path).truncate(maxLength: 20),
//                           style: const TextStyle(overflow: TextOverflow.clip),
//                         ),
//                         const SizedBox(width: 8),
//                         Container(
//                           height: 6,
//                           width: 6,
//                           decoration: BoxDecoration(
//                             shape: BoxShape.circle,
//                             color: context.colorScheme.surfaceDim,
//                           ),
//                         ),
//                         const SizedBox(width: 8),
//                         Texts.caption(
//                           context,
//                           getFileSizeInKB(file!),
//                           style: TextStyle(
//                               color: context.colorScheme.onSurface
//                                   .withOpacity(0.5)),
//                         ),
//                         const Spacer(),
//                         GdiIcon(
//                           color: context.colorScheme.surfaceDim,
//                           icon: "Chevron_Right",
//                           height: 18,
//                           width: 18,
//                         ),
//                       ],
//                     ),
//                   ),
//                 const SizedBox(height: 80),
//               ],
//             ),
//           )
//         ],
//       ),
//     );
//   }
// }

// class FormFilePickerSheet<T> extends ConsumerStatefulWidget {
//   const FormFilePickerSheet({
//     super.key,
//     required this.name,
//     required this.sheetLabel,
//     required this.labelText,
//     this.prefixIcon,
//     this.onSaved,
//     this.initialValue,
//     this.autoValidateMode,
//     this.enabled = true,
//     this.validator,
//     this.valueTransformer,
//     required this.onChanged,
//     required this.onRemoved,
//     this.backgroundColor,
//     this.disabledColor,
//     this.labelPadding,
//     this.labelStyle,
//     this.materialTapTargetSize,
//     this.padding,
//     this.selectedColor,
//     this.selectedShadowColor,
//     this.shadowColor,
//     this.shape,
//     this.badge,
//     this.autofilled = false,
//     required this.onOCRResult,
//   });

//   final String name;
//   final String sheetLabel;
//   final String labelText;

//   final Function(T?)? onSaved;
//   final T? initialValue;
//   final AutovalidateMode? autoValidateMode;
//   final bool enabled;
//   final String? Function(T?)? validator;

//   final ValueTransformer<T?>? valueTransformer;
//   final ValueChanged<T?>? onChanged;
//   final ValueChanged<T?> onRemoved;

//   final Widget? prefixIcon;

//   final Color? backgroundColor;

//   final Color? disabledColor;

//   final EdgeInsets? labelPadding;
//   final TextStyle? labelStyle;
//   final MaterialTapTargetSize? materialTapTargetSize;
//   final EdgeInsets? padding;

//   final Color? selectedColor;
//   final Color? selectedShadowColor;
//   final Color? shadowColor;
//   final BoxShape? shape;

//   final Widget? badge;
//   final bool autofilled;
//   final Function(OCRResult) onOCRResult;

//   @override
//   ConsumerState<FormFilePickerSheet<T>> createState() =>
//       _FormFilePickerSheetState<T>();
// }

// class _FormFilePickerSheetState<T>
//     extends ConsumerState<FormFilePickerSheet<T>> {
//   @override
//   Widget build(BuildContext context) {
//     return Stack(
//       children: [
//         FormBuilderField<T>(
//           name: widget.name,
//           validator: widget.validator,
//           initialValue: widget.initialValue,
//           autovalidateMode: widget.autoValidateMode,
//           enabled: widget.enabled,
//           valueTransformer: widget.valueTransformer,
//           onChanged: widget.onChanged,
//           builder: (FormFieldState<dynamic> field) {
//             return CupertinoButton(
//               padding: const EdgeInsets.all(0),
//               onPressed: widget.enabled
//                   ? () {
//                       DialogUtil.showBottomSheet(
//                         context: context,
//                         expand: false,
//                         child: PickerSheet(
//                           name: widget.name,
//                           title: widget.sheetLabel,
//                           onOCRResult: widget.onOCRResult,
//                           onSelected: (String? value) {
//                             field.didChange(value);
//                           },
//                         ),
//                       );
//                     }
//                   : null,
//               child: InputDecorator(
//                 decoration: InputDecoration(
//                   counterText: "",
//                   isDense: true,
//                   prefixIconConstraints: const BoxConstraints(
//                     minWidth: 18 + 8,
//                     maxWidth: 18 + 8,
//                     minHeight: 18,
//                     maxHeight: 18,
//                   ),
//                   border: InputBorder.none,
//                   prefixIcon: widget.prefixIcon,
//                 ),
//                 child: SizedBox(
//                   height: 60,
//                   child: Row(
//                     mainAxisSize: MainAxisSize.max,
//                     mainAxisAlignment: MainAxisAlignment.start,
//                     children: [
//                       Stack(
//                         children: [
//                           Padding(
//                             padding: const EdgeInsets.all(8.0),
//                             child: Container(
//                               width: 32,
//                               height: 32,
//                               decoration: BoxDecoration(
//                                 borderRadius: BorderRadius.circular(50),
//                                 color: context.colorScheme.secondary
//                                     .withOpacity(0.1),
//                               ),
//                               child: Center(
//                                 child: GdiIcon(
//                                   icon: "Id_Card_Filled",
//                                   color: context.colorScheme.secondary,
//                                   height: 16,
//                                   width: 16,
//                                 ),
//                               ),
//                             ),
//                           ),
//                           if (field.value != null)
//                             const Positioned(
//                               bottom: 4,
//                               right: 4,
//                               child: _BadgeCheck(),
//                             ),
//                           if (field.value == null)
//                             Positioned(
//                               bottom: 4,
//                               right: 4,
//                               child: Container(
//                                 width: 16,
//                                 height: 16,
//                                 decoration: BoxDecoration(
//                                   borderRadius: BorderRadius.circular(50),
//                                   color: ColorUtils.warningColor,
//                                   border: Border.all(
//                                     width: 2,
//                                     color: context.colorScheme.surface,
//                                   ),
//                                 ),
//                                 child: GdiIcon(
//                                   icon: "Question_Mark",
//                                   color: context.colorScheme.onPrimary,
//                                   height: 8,
//                                   width: 8,
//                                 ),
//                               ),
//                             ),
//                         ],
//                       ),
//                       const SizedBox(width: 8),
//                       Expanded(
//                         flex: 5,
//                         child: Texts.b4(
//                           context,
//                           widget.labelText,
//                         ),
//                       ),
//                       Spacer(),
//                       field.value == null
//                           ? GdiIcon(
//                               icon: "Chevron_Right",
//                               color: context.colorScheme.surfaceDim,
//                             )
//                           : IconButton(
//                               onPressed: () async {
//                                 bool confirm = await DialogUtil.confirm(
//                                   context: context,
//                                   title: "លុបឯកសារ?",
//                                 );
//                                 if (confirm) {
//                                   field.didChange(null);
//                                   widget.onRemoved(field.value);
//                                 }
//                               },
//                               icon: GdiIcon(
//                                 icon: "X",
//                                 color: context.colorScheme.surfaceDim,
//                               ),
//                             )
//                     ],
//                   ),
//                 ),
//               ),
//             );
//           },
//         ),
//         Positioned(
//           right: 0,
//           top: 0,
//           child: AnimatedOpacity(
//             opacity: widget.autofilled ? 1 : 0,
//             duration: Durations.medium3,
//             curve: Curves.easeInOutQuad,
//             child: AnimatedScale(
//               scale: widget.autofilled ? 1 : 0,
//               duration: Durations.medium3,
//               curve: Curves.easeInOutQuad,
//               child: const AiAutoFilledMarker(),
//             ),
//           ),
//         )
//       ],
//     );
//   }
// }
