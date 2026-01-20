import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';

class AxonRadioInput extends AxonBaseInput {
  const AxonRadioInput({super.key, required super.node});

  @override
  State<AxonRadioInput> createState() => _AxonRadioInputState();
}

class _AxonRadioInputState extends State<AxonRadioInput> {
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
            RadioGroup<String>(
              groupValue: formFieldState.value,
              onChanged: (String? s) {
                formFieldState.didChange(s);
              },
              child: Column(
                children: options.map((option) {
                  return ListTile(
                    title: Text(option.label),
                    leading: Radio<String>(value: option.id),
                  );
                }).toList(),
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
