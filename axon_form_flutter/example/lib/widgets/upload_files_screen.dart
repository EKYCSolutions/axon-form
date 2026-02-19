// import 'dart:convert';
// import 'dart:io';
// import 'package:axon_form_flutter/axon_form_flutter.dart';
// import 'package:axon_form_flutter_example/model/document_requirement.dart';
// import 'package:axon_form_flutter_example/provider/passport_application_form_provider.dart';
// import 'package:axon_form_flutter_example/widgets/shared/base_card.dart';
// import 'package:axon_form_flutter_example/widgets/shared/constant.dart';
// import 'package:axon_form_flutter_example/widgets/shared/dialog_util.dart';
// import 'package:axon_form_flutter_example/widgets/shared/document_picker_sheet.dart';
// import 'package:axon_form_flutter_example/widgets/shared/flash_message.dart';
// import 'package:axon_form_flutter_example/widgets/shared/form_image_picker.dart';
// import 'package:axon_form_flutter_example/widgets/shared/gdi_icon.dart'
//     show GdiIcon;
// import 'package:axon_form_flutter_example/widgets/shared/required_document_image_card.dart';
// import 'package:collection/collection.dart';
// import 'package:ekyc_id_flutter/ekyc_id_flutter.dart';
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';

// class UploadFilesScreen extends StatefulWidget {
//   const UploadFilesScreen({super.key});

//   @override
//   State<UploadFilesScreen> createState() => _UploadFilesScreenState();
// }

// class _UploadFilesScreenState extends State<UploadFilesScreen> {
//   @override
//   void initState() {
//     super.initState();
//     WidgetsBinding.instance.addPostFrameCallback((_) async {
//       // if (ref.read(formApplicationType) !=
//       //     FormApplicationType.requestOnBehalf) {
//       //   checkUserOcrResult();
//       // }
//     });
//   }

//   checkUserOcrResult() {
//     // List<FileEntity>? files =
//     //     ref.read(myFilesController.notifier).getFilesByFileTypes(fileTypes: [
//     //   MyFilesType.NATIONAL_ID,
//     // ]);

//     // User? user = ref.read(authController).user;

//     // if (files.isNotEmpty &&
//     //     user != null &&
//     //     user.firstNameEng != null &&
//     //     user.lastNameEng != null) {
//     //   String fullName =
//     //       "${user.lastNameEng?.toLowerCase()}_${user.firstNameEng?.toLowerCase()}";
//     //   FileEntity? nationalIdCard = files.firstWhereOrNull(
//     //       (FileEntity i) => i.fileName.toLowerCase().contains(fullName));

//     //   final selectedSubService =
//     //       ref.read(formApplicationController).fields!["sub_service"];

//     //   final List<Service> services = ref.read(configurationProvider).services;

//     //   final subServices = services.first.subServices;
//     //   final DocumentRequirement? documents = subServices
//     //       .firstWhere(
//     //           (SubService subService) => subService.id == selectedSubService)
//     //       .documentRequirement;

//     //   final String? id = documents?.personal?.documentGroups
//     //       .firstWhereOrNull((i) => i.document.slug == "khmer_id_card")
//     //       ?.document
//     //       .id
//     //       .toString();

//     //   if (nationalIdCard != null) {
//     //     OCRResult ocrResult =
//     //         OCRResult.fromJson(jsonDecode(nationalIdCard.ocrResult));

//     //     _formKey.currentState?.patchValue({
//     //       "khmer_id_card": nationalIdCard.filePath,
//     //       "khmer_id_card_id": id,
//     //     });

//     //     ref
//     //         .read(formApplicationController.notifier)
//     //         .onAutofillFromOcr(ocrResult);
//     //   }
//     //   _formKey.currentState?.save();
//     //   setState(() {});
//     // } else {
//     //   print("in else");
//     // }
//   }

//   onFileSelected(Attachment attachment) async {
//     // _formKey.currentState?.save();
//     // setState(() {});
//     // ref.read(formApplicationController.notifier).addAttachment(attachment);
//     print("onFileSelected");
//   }

//   onFileRemoved(filePath) async {
//     // _formKey.currentState?.save();
//     setState(() {});
//     File file = File(filePath);
//     if (await file.exists()) {
//       try {
//         file.delete();
//       } catch (e) {
//         // loge(e: e, msg: "cannot delete file");
//       }
//     }
//   }

//   _onApplicantPhotoChanged(File photo) async {
//     try {
//       // await ref
//       //     .read(formApplicationController.notifier)
//       //     .onApplicantPhotoChanged(photo);
//     } catch (e) {
//       print(
//         "the photo cannot verify as face. your photo may be blurry or blocked",
//       );
//       print("error msg $e");
//       DialogUtil.showErrorDialog(
//         context,
//         content: Text(
//           "រូបថតមិនអាចផ្ទៀងផ្ទាត់ថាជាមុខបានទេ។ រូបថតរបស់អ្នកប្រហែលជាមិនច្បាស់ ឬត្រូវបានបាំង។",
//           style: context.textTheme.bodySmall,
//         ),
//       );

//       /// TODO: remove the invalid photo from the form state
//       // _formKey.currentState?.patchValue({"applicant_photo": null});
//     }
//     //
//   }

//   onOCRResult(OCRResult result, String documentName) {
//     // if (documentName == "khmer_id_card_guardian") {
//     //   ref.read(formApplicationController.notifier).onAutofillGurantee(result);
//     //   return;
//     // }
//     // ref.read(formApplicationController.notifier).onAutofillFromOcr(result);
//   }

//   @override
//   Widget build(BuildContext context) {
//     final provider = Provider.of<PassportApplicationFormProvider>(
//       context,
//       listen: false,
//     );
//     Map<String, List<DocumentGroup>> grouped = {};
//     DocumentRequirementCondition requirementConditions = provider
//         .getDocumentRequirementConditions();
//     grouped = requirementConditions.documentGroups.groupListsBy((i) => i.group);

//     return SingleChildScrollView(
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.stretch,
//         children: [
//           Padding(
//             padding: Constants.containerPadding,
//             child: const RequiredDocumentImageCard(),
//           ),
//           Padding(
//             padding: Constants.containerPadding,
//             child: FlashMessage(
//               widget: Row(
//                 children: [
//                   Text(
//                     "សញ្ញា",
//                     style: context.textTheme.bodySmall?.copyWith(
//                       color: context.colorScheme.onTertiary,
//                     ),
//                   ),
//                   const SizedBox(width: 4),
//                   GdiIcon(
//                     icon: "Check_Circle_Filled",
//                     width: 14,
//                     height: 14,
//                     color: context.colorScheme.onTertiary,
//                   ),
//                   const SizedBox(width: 4),
//                   Text(
//                     "បញ្ជាក់ថាធ្លាប់មានរួចហើយ",
//                     style: context.textTheme.bodySmall?.copyWith(
//                       color: context.colorScheme.onTertiary,
//                     ),
//                   ),
//                 ],
//               ),
//               icon: GdiIcon(
//                 icon:
//                     "Spa                                                                                                                  rkle_Filled",
//                 color: context.colorScheme.onTertiary,
//               ),
//             ),
//           ),
//           if (provider.formApplicationType ==
//               FormApplicationType.requestOnBehalf)
//             Padding(
//               padding: Constants.containerPadding,
//               child: BaseCard(
//                 child: FormImagePickerSheet(
//                   // validator: FormBuilderValidators.required(),
//                   name: "applicant_photo",
//                   sheetLabel: "រូបថតអ្នកដាក់ពាក្យ",
//                   labelText: "រូបថតអ្នកដាក់ពាក្យ",
//                   initialValue: provider.applicationDob,
//                   onChanged: _onApplicantPhotoChanged,
//                   onRemoved: (_) {},
//                 ),
//               ),
//             ),
//           Builder(
//             builder: (context) {
//               int index = 1;
//               final widgets = grouped.entries.map((entry) {
//                 List<DocumentGroup> documents = entry.value;
//                 final groupCondition = requirementConditions
//                     .groupConditions
//                     .conditions
//                     .entries
//                     .firstWhereOrNull((e) => e.key == entry.key);

//                 final required =
//                     (groupCondition?.value != null) &&
//                     groupCondition!.value.isRequired;

//                 final title = required
//                     ? "required_attacted_documents ${index.toString()}"
//                     : "Optional_attacted_documents";
//                 // ? "${context.localize.required_attacted_documents} ទី${index.toString().toKhmerNum()}"
//                 // : context.localize.optional_attacted_documents;
//                 List<String> slugs = documents
//                     .map((i) => i.document.slug)
//                     .toList();
//                 // final errors = _formKey.currentState?.errors;
//                 // final hasErrors = slugs.any(
//                 //   (field) =>
//                 //       errors?.containsKey(field) == true &&
//                 //       errors![field] != null,
//                 // );
//                 // print("hasErrors $hasErrors");

//                 final String description = slugs.length > 1
//                     ? "សូមជ្រើសរើសឯកសារ ១ ក្នុងចំណោមឯកសារទាំងនេះ"
//                     : "សូមបំពេញឯកសារខាងក្រោម";
//                 final widget = Padding(
//                   padding: Constants.containerPadding,
//                   child: BaseCard(
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         // FormSectionHeader(
//                         //   title: title,
//                         //   description: description,
//                         //   titleMaxWidth: double.infinity,
//                         // ),
//                         const SizedBox(height: 16),
//                         // if (hasErrors)
//                         //   Text(
//                         //     "សូមបញ្ចូលឯកសារ ១ ក្នុងចំណោមឯកសារទាំងនេះដើម្បីបន្ត",
//                         //     style: context.textTheme.labelSmall?.copyWith(
//                         //       color: context.colorScheme.error,
//                         //     ),
//                         //   ),
//                         DocumentPickerSheet(
//                           // formKey: _formKey,
//                           documents: documents,
//                           onFileSelected: onFileSelected,
//                           onOCRResult: onOCRResult,
//                           onFileRemoved: onFileRemoved,
//                           required: required,
//                         ),
//                       ],
//                     ),
//                   ),
//                 );
//                 if (required) index++;

//                 return widget;
//               }).toList();
//               return Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: widgets,
//               );
//             },
//           ),
//           const SizedBox(height: 300),
//         ],
//       ),
//     );
//   }
// }

// class Attachment {
//   String? name;
//   String? documentTypeId;
//   String? filePath;

//   Attachment({this.name, this.filePath, this.documentTypeId});
// }
