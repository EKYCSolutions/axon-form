import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';

class AxonDropdownInput extends AxonBaseInput {
  const AxonDropdownInput({super.key, required super.node});

  @override
  State<AxonDropdownInput> createState() => _AxonDropdownInputState();
}

class _AxonDropdownInputState extends State<AxonDropdownInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final options = controller.getOptions(widget.node.id);

    return FormField<String?>(
      initialValue: widget.node.value,
      validator: (String? s) {
        var res = controller.validateNode(widget.node.id, s);
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            DropdownButton<String>(
              value: formFieldState.value,
              hint: Text(widget.node.label),
              items: options.map((option) {
                return DropdownMenuItem<String>(
                  value: option.id,
                  child: Text(option.label),
                );
              }).toList(),
              onChanged: (value) {
                formFieldState.didChange(value);
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
