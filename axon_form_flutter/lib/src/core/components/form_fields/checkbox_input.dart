import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';

class AxonCheckboxInput extends AxonBaseInput {
  const AxonCheckboxInput({super.key, required super.node});

  @override
  State<AxonCheckboxInput> createState() => _AxonCheckboxInputState();
}

class _AxonCheckboxInputState extends State<AxonCheckboxInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    return FormField<bool?>(
      initialValue: widget.node.value ?? false,
      validator: (bool? value) {
        var res = controller.validateNode(widget.node.id, value?.toString());
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CheckboxListTile(
              title: Text(widget.node.label),
              value: formFieldState.value,
              onChanged: (bool? value) {
                formFieldState.didChange(value);
              },
              controlAffinity: ListTileControlAffinity.leading,
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
