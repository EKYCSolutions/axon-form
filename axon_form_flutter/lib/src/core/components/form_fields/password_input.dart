import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:axon_form_flutter/src/core/components/styles/password_input_style.dart';
import 'package:flutter/material.dart';

class AxonPasswordInput extends AxonBaseInput {
  const AxonPasswordInput({super.key, required super.node, this.style});

  final AxonFormPasswordInputStyle? style;

  @override
  State<AxonPasswordInput> createState() => _AxonPasswordInputState();
}

class _AxonPasswordInputState extends State<AxonPasswordInput> {
  bool _obscureText = true;
  String? errorMessage;

  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormPasswordInputStyle>() ??
        AxonFormPasswordInputStyle.fallback(context);

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
              decoration: style.decoration?.copyWith(
                labelText: widget.node.label,
                hintText: widget.node.placeholder,
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
