import 'package:axon_form_flutter/src/utils/util.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class BaseFileInput extends StatefulWidget {
  const BaseFileInput({
    super.key,
    required this.builder,
    required this.onChanged,
    this.enabled = true,
    this.required = false,
    this.validator,
    this.autoValidateMode,
  });
  final Widget Function(BuildContext, FormFieldState) builder;

  final void Function(Uint8List) onChanged;
  final bool enabled;
  final bool required;
  final String? Function(Uint8List?)? validator;
  final AutovalidateMode? autoValidateMode;

  @override
  State<BaseFileInput> createState() => _BaseFileInputState();
}

class _BaseFileInputState extends State<BaseFileInput> {
  FormFieldState<Uint8List>? f;

  void onFileSelected() async {
    Uint8List? selectedFile = await pickImageAsBytes();

    if (selectedFile != null) {
      widget.onChanged(selectedFile);
      f?.didChange(selectedFile);
    }
  }

  @override
  Widget build(BuildContext context) {
    return FormField<Uint8List>(
      validator: (Uint8List? s) {
        // if ((s == null) && widget.required) {
        //   return "required";
        // }
        return widget.validator?.call(s);
      },
      autovalidateMode:
          widget.autoValidateMode ?? AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        f = formFieldState;
        return GestureDetector(
          onTap: widget.enabled
              ? () async {
                  onFileSelected();
                }
              : null,
          child: widget.builder(context, formFieldState),
        );
      },
    );
  }
}
