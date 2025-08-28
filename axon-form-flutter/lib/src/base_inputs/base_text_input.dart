import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class BaseTextInput extends StatefulWidget {
  const BaseTextInput({
    super.key,
    required this.label,
    this.required = false,

    this.prefixIcon,
    this.autovalidateMode = AutovalidateMode.onUserInteraction,
    this.enabled = true,
    this.validator,
    this.onChanged,
    this.keyboardType,
    this.inputFormatters,
    this.maxLength,
    this.initialValue,
    this.maxLines,
  });

  final Widget? prefixIcon;
  final String label;
  final AutovalidateMode? autovalidateMode;
  final String? Function(String?)? validator;
  final bool enabled;
  final bool required;
  final void Function(String?)? onChanged;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final int? maxLength;
  final String? initialValue;
  final int? maxLines;
  @override
  State<BaseTextInput> createState() => _BaseTextInputState();
}

class _BaseTextInputState extends State<BaseTextInput> {
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (widget.initialValue != null) {
      _controller.text = widget.initialValue!;
    }
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(widget.label),
                  if (widget.required) Text("*"),
                  const Spacer(),
                ],
              ),
              FormField<String>(
                enabled: widget.enabled,
                builder: (field) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      CupertinoTextField(
                        controller: _controller,
                        decoration: BoxDecoration(color: Colors.transparent),
                        crossAxisAlignment: CrossAxisAlignment.start,
                        maxLines: widget.maxLines,
                        onChanged: (String s) {
                          widget.onChanged?.call(s);
                          field.didChange(s);
                        },
                        enabled: widget.enabled,
                        keyboardType: widget.keyboardType,
                        inputFormatters: widget.inputFormatters,
                        maxLength: widget.maxLength,
                        // autofillHints: widget.autofillHints,
                        prefix: widget.prefixIcon,
                      ),
                      if (field.hasError) Text(field.errorText!),
                    ],
                  );
                },
                initialValue: widget.initialValue,
                autovalidateMode: widget.autovalidateMode,
                validator: (String? s) {
                  // if ((s == null || s == '') && widget.required) {
                  //   return "required";
                  // }

                  return widget.validator?.call(s);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
