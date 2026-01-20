import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class AxonPasswordInput extends AxonBaseInput {
  const AxonPasswordInput({super.key, required super.node});

  @override
  State<AxonPasswordInput> createState() => _AxonPasswordInputState();
}

class _AxonPasswordInputState extends State<AxonPasswordInput> {
  bool _obscureText = true;
  String? errorMessage;

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    return FormField<String?>(
      validator: (String? s) {
        var res = controller.validateNode(widget.node.id, s);
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              obscureText: _obscureText,
              decoration: InputDecoration(
                labelText: widget.node.label,
                hintText: widget.node.placeholder,
                // labelStyle: widget.theme.labelStyle,
                // border: baseDecoration.border ?? OutlineInputBorder(),
                // contentPadding: baseDecoration.contentPadding,
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureText ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () => setState(() => _obscureText = !_obscureText),
                ),
              ),
              onChanged: (String s) {
                formFieldState.didChange(s);
              },
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
