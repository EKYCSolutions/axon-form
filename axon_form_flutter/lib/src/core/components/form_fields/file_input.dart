import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

class AxonFileInput extends AxonBaseInput {
  const AxonFileInput({super.key, required super.node});

  @override
  State<AxonFileInput> createState() => _AxonFileInputState();
}

class _AxonFileInputState extends State<AxonFileInput> {
  PlatformFile? _selectedFile;

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    return FormField<Uint8List?>(
      validator: (Uint8List? f) {
        String? valueToSend;
        if (f != null) {
          valueToSend = base64Encode(f);
        }
        final res = controller.validateNode(widget.node.id, valueToSend);
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.node.label),
            SizedBox(height: 8),
            if (_selectedFile == null)
              OutlinedButton.icon(
                icon: Icon(Icons.upload_file),
                label: Text(widget.node.placeholder ?? 'Choose File'),
                onPressed: () async {
                  FilePickerResult? result = await FilePicker.platform
                      .pickFiles(withData: true);

                  if (result != null) {
                    final platformFile = result.files.first;

                    if (platformFile.path != null) {
                      File file = File(platformFile.path!);
                      Uint8List bytes = await file.readAsBytes();

                      setState(() {
                        _selectedFile = platformFile;
                      });
                      formFieldState.didChange(bytes);
                    }
                  }
                },
              )
            else
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.insert_drive_file),
                title: Text(_selectedFile!.name),
                subtitle: Text(
                  '${(_selectedFile!.size / 1024).toStringAsFixed(2)} KB',
                ),
                trailing: IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () {
                    setState(() {
                      _selectedFile = null;
                    });
                    formFieldState.didChange(null);
                  },
                ),
              ),
            if (formFieldState.errorText != null)
              Padding(
                padding: const EdgeInsets.only(top: 4.0),
                child: buildError(context, formFieldState.errorText!),
              ),
          ],
        );
      },
    );
  }
}
