// import 'package:axon_form_flutter_example/model/document_requirement.dart';
// import 'package:axon_form_flutter_example/widgets/shared/form_file_picker_sheet.dart';
// import 'package:axon_form_flutter_example/widgets/upload_files_screen.dart';
// import 'package:ekyc_id_flutter/ekyc_id_flutter.dart';
// import 'package:flutter/material.dart';

// class DocumentPickerSheet extends StatefulWidget {
//   const DocumentPickerSheet({
//     super.key,

//     required this.documents,
//     required this.onFileSelected,
//     required this.onFileRemoved,
//     required this.required,
//     required this.onOCRResult,
//   });

//   final List<DocumentGroup> documents;

//   final Function(Attachment) onFileSelected;
//   final Function(String?) onFileRemoved;
//   final bool required;
//   final Function(OCRResult, String) onOCRResult;

//   @override
//   DocumentPickerSheetState createState() => DocumentPickerSheetState();
// }

// class DocumentPickerSheetState extends State<DocumentPickerSheet> {
//   // Either-Or Validator
//   /// Multi-Field Validator
//   String? multiFieldValidator(String? value, List<String> otherFieldNames) {


//     // if (currentState == null) return null;

//     // // Check if the current field or any of the other fields are filled
//     // final isAnyFieldFilled =
//     //     [
//     //       value,
//     //       ...otherFieldNames.map((name) => currentState.fields[name]?.value),
//     //     ].any(
//     //       (fieldValue) =>
//     //           fieldValue != null && fieldValue.toString().isNotEmpty,
//     //     );

//     // // Return error if none are filled
//     // if (!isAnyFieldFilled) {
//     //   return 'At least one of these fields must be filled.';
//     // }

//     return null;
//   }

//   @override
//   Widget build(BuildContext context) {
//     List<String> slugs = widget.documents.map((i) => i.document.slug).toList();

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: widget.documents.map((DocumentGroup documentGroup) {
//         Document document = documentGroup.document;

//         return Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             FormFilePickerSheet<String?>(
//               labelText: document.nameKhm,
//               sheetLabel: document.nameKhm,
//               name: document.slug,
//               initialValue:
//                   widget.formKey.currentState?.instantValue[document.slug],
//               validator: widget.required
//                   ? (value) => multiFieldValidator(value, slugs)
//                   : null,
//               onOCRResult: (OCRResult result) =>
//                   widget.onOCRResult(result, document.slug),
//               onChanged: (String? value) {
//                 if (value == null) {
//                   return;
//                 }
//                 final attachment = Attachment(
//                   name: document.slug,
//                   filePath: value,
//                   documentTypeId: document.id.toString(),
//                 );
//                 widget.onFileSelected(attachment);
//               },
//               onRemoved: (_) {
//                 widget.onFileRemoved(document.nameEng);
//               },
//             ),
//             if (documentGroup.note != null)
//               Texts.caption(
//                 context,
//                 documentGroup.note!,
//                 style: TextStyle(color: context.colorScheme.onSurfaceVariant),
//               ),
//           ],
//         );
//       }).toList(),
//     );
//   }
// }
