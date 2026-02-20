// // ignore_for_file: use_build_context_synchronously

// import 'dart:io';

// import 'package:dio/dio.dart';
// import 'package:ekyc_id_flutter/ekyc_id_flutter.dart';
// import 'package:flutter/cupertino.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_form_builder/flutter_form_builder.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:gdi_online_application/src/commons/providers/file_provider.dart';
// import 'package:gdi_online_application/src/commons/widgets/gdi_icon.dart';
// import 'package:gdi_online_application/src/commons/widgets/inputs/ai_autofilled_marker.dart';
// import 'package:gdi_online_application/src/commons/widgets/texts.dart';
// import 'package:gdi_online_application/src/const.dart';
// import 'package:gdi_online_application/src/routing/app_router.dart';
// import 'package:gdi_online_application/src/utils/dialog_util.dart';
// import 'package:gdi_online_application/src/utils/extensions.dart';
// import 'package:gdi_online_application/src/utils/log_util.dart';
// import 'package:go_router/go_router.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:permission_handler/permission_handler.dart';
// import 'package:smooth_corner/smooth_corner.dart';

// // import '../../../features/profile/providers/profile_provider.dart';

// import '../../providers/profile_provider.dart';

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

// class _OptionsSheet extends ConsumerStatefulWidget {
//   const _OptionsSheet({
//     super.key,
//     required this.onTakePhoto,
//     required this.onPickFromGallery,
//   });

//   final VoidCallback onTakePhoto;
//   final VoidCallback onPickFromGallery;

//   @override
//   ConsumerState<_OptionsSheet> createState() => __OptionsSheetState();
// }

// class __OptionsSheetState extends ConsumerState<_OptionsSheet> {
//   @override
//   Widget build(BuildContext context) {
//     return SizedBox(
//       height: 250,
//       child: SmoothClipRRect(
//         smoothness: 1,
//         borderRadius: const BorderRadius.only(
//           topLeft: Radius.circular(32),
//           topRight: Radius.circular(32),
//         ),
//         child: Container(
//           color: context.colorScheme.surface,
//           padding: Constants.containerPadding,
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.stretch,
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               const SizedBox(height: 20),
//               Flexible(
//                 fit: FlexFit.tight,
//                 child: _body(context),
//               ),
//               SizedBox(
//                 height: MediaQuery.of(context).padding.bottom == 0
//                     ? 16
//                     : MediaQuery.of(context).padding.bottom,
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Column _body(BuildContext context) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Texts.h3(context, "យករូបភាពពី"),
//         const SizedBox(height: 14),
//         SizedBox(
//           height: 62,
//           child: CupertinoButton(
//             padding: const EdgeInsets.all(0),
//             onPressed: () {
//                context.pop();
//               widget.onPickFromGallery();
//             },
//             child: Row(
//               children: [
//                 Container(
//                   decoration: BoxDecoration(
//                     color: context.colorScheme.secondary.withOpacity(0.2),
//                     shape: BoxShape.circle,
//                   ),
//                   height: 46,
//                   width: 46,
//                   child: Center(
//                     child: GdiIcon(
//                       icon: "Image_Filled",
//                       color: context.colorScheme.secondary,
//                     ),
//                   ),
//                 ),
//                 const SizedBox(width: 16),
//                 Expanded(
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     mainAxisAlignment: MainAxisAlignment.center,
//                     children: [
//                       Texts.b4(context, "កម្មវិធីរូបថត"),
//                     ],
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ),
//         SizedBox(
//           height: 62,
//           child: CupertinoButton(
//             padding: const EdgeInsets.all(0),
//             onPressed: () {
//                context.pop();
//               widget.onTakePhoto();
//             },
//             child: Row(
//               children: [
//                 Container(
//                   decoration: BoxDecoration(
//                     color: context.colorScheme.secondary.withOpacity(0.2),
//                     shape: BoxShape.circle,
//                   ),
//                   height: 46,
//                   width: 46,
//                   child: Center(
//                     child: GdiIcon(
//                       icon: "Camera",
//                       color: context.colorScheme.secondary,
//                     ),
//                   ),
//                 ),
//                 const SizedBox(width: 16),
//                 Expanded(
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     mainAxisAlignment: MainAxisAlignment.center,
//                     children: [
//                       Texts.b4(context, "ថតថ្មី"),
//                     ],
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ],
//     );
//   }
// }

// class FormImagePickerSheet<T> extends ConsumerStatefulWidget {
//   const FormImagePickerSheet({
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
//   final Function(File) onChanged;
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

//   @override
//   ConsumerState<FormImagePickerSheet<T>> createState() =>
//       _FormImagePickerSheetState<T>();
// }

// class _FormImagePickerSheetState<T>
//     extends ConsumerState<FormImagePickerSheet<T>> {
//   File? image;

//   Future<void> onPickFromGallery(FormFieldState<dynamic> field) async {
//     bool cameraGranted = await ref
//         .read(profileProvider.notifier)
//         .checkAndRequestPhotoPermission(context);
//     if (!cameraGranted) {
//       return;
//     }

//     DialogUtil.showLoading(context);
//     try {
//       XFile? profilePhoto =
//           await ref.read(fileProvider).pickImageAsXFile(imageQuality: 30);

//       if (profilePhoto != null) {
//         // Do something with picked image

//         field.didChange(profilePhoto.path);
//         setState(() {
//           image = File(profilePhoto.path);
//         });
//         widget.onChanged(image!);
//       }
//        context.pop();
//     } catch (e) {
//       if (e is DioException) {
//         logr(e: e);
//         return;
//       }
//       loge(e: e);
//        context.pop();
//     }
//   }

//   Future<void> onTakePhoto(FormFieldState<dynamic> field) async {
//     bool cameraGranted = await ref
//         .read(profileProvider.notifier)
//         .checkAndRequestCameraPermission(context);
//     if (!cameraGranted) {
//       return;
//     }
//     DialogUtil.showLoading(context);
//     try {
//       LivenessFace? result = await  context.push(
//             "/application/scan_face",
//           );

//       File? profilePhoto = await ref
//           .read(fileProvider)
//           .saveImage(result!.image, fileName: "Profile_Photo");

//       if (profilePhoto != null) {
//         field.didChange(profilePhoto.path);
//         setState(() {
//           image = profilePhoto;
//         });
//         widget.onChanged(image!);
//       }
//       // ref.refresh(authController);
//        context.pop();
//     } catch (e) {
//       if (e is DioException) {
//         logr(e: e);
//         return;
//       }
//       loge(e: e);

//        context.pop();
//     }
//   }

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
//           builder: (FormFieldState<dynamic> field) {
//             return CupertinoButton(
//               padding: const EdgeInsets.all(0),
//               onPressed: widget.enabled
//                   ? () {
//                       DialogUtil.showBottomSheet(
//                         context: context,
//                         expand: false,
//                         child: _OptionsSheet(
//                           onPickFromGallery: () => onPickFromGallery(field),
//                           onTakePhoto: () => onTakePhoto(field),
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
//                   height: 120,
//                   child: Row(
//                     children: [
//                       Stack(
//                         children: [
//                           Padding(
//                             padding: const EdgeInsets.all(8.0),
//                             child: field.value == null
//                                 ? Container(
//                                     width: 80,
//                                     height: 120,
//                                     decoration: BoxDecoration(
//                                       borderRadius: BorderRadius.circular(8),
//                                       color: context.colorScheme.secondary
//                                           .withOpacity(0.1),
//                                     ),
//                                     child: Center(
//                                       child: GdiIcon(
//                                         icon: "User",
//                                         color: context.colorScheme.secondary,
//                                         height: 36,
//                                         width: 36,
//                                       ),
//                                     ),
//                                   )
//                                 : ClipRRect(
//                                     borderRadius: BorderRadius.circular(8),
//                                     child: SizedBox(
//                                       width: 80,
//                                       height: 120,
//                                       child: Image.file(
//                                         File(field.value),
//                                         key: ValueKey(field.value),
//                                         fit: BoxFit.cover,
//                                       ),
//                                     ),
//                                   ),
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
//                       Padding(
//                         padding: Constants.containerPadding,
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Texts.h3(
//                               context,
//                               widget.labelText,
//                             ),
//                             const SizedBox(height: 8),
//                             Texts.b4(
//                                 context, "ជ្រើសរើសពីកម្មវិធីរូបថត ឬ ថតថ្មី",
//                                 style: TextStyle(
//                                   color: context.colorScheme.onSurfaceVariant,
//                                 )),
//                           ],
//                         ),
//                       ),
//                       const Spacer(),
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
