// import 'package:flutter/material.dart';
// import 'package:file_picker/file_picker.dart';
// import 'base_form_field.dart';
// import '../../models/form_config.dart';
// import '../../state/form_state_notifier.dart';
// import '../../config/form_theme.dart';

// class FileFieldWidget extends BaseFormField {
//   const FileFieldWidget({
//     Key? key,
//     required FormNode node,
//     required FormStateNotifier formState,
//     required FormTheme theme,
//   }) : super(key: key, node: node, formState: formState, theme: theme);

//   @override
//   Widget buildField(BuildContext context) {
//     // final PlatformFile? selectedFile = formState.getValue(node.fieldName);

//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Text(node.label, style: theme.labelStyle ?? TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
//         SizedBox(height: 8),
//         OutlinedButton.icon(
//           icon: Icon(Icons.upload_file),
//           label: Text(node.placeholder ?? 'Choose File'),
//           style: theme.secondaryButtonStyle,
//           onPressed: () async {
//             // FilePickerResult? result = await FilePicker.platform.pickFiles();
//             // if (result != null) {
//             //   formState.setValue(node.fieldName, result.files.first);
//             // }
//           },
//         ),
//         if (selectedFile != null)
//           Padding(
//             padding: const EdgeInsets.only(top: 8.0),
//             child: Text(
//               'Selected: ${selectedFile.name}',
//               style: TextStyle(fontSize: 14, color: Colors.green),
//             ),
//           ),
//       ],
//     );
//   }
// }
