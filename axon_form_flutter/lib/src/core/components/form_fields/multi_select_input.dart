import 'package:axon_form_flutter/src/core/components/builders/error_builder.dart';
import 'package:axon_form_flutter/src/core/components/form_fields/base_input.dart';
import 'package:flutter/material.dart';

class AxonMultiSelectInput extends AxonBaseInput {
  const AxonMultiSelectInput({super.key, required super.node});

  @override
  State<AxonMultiSelectInput> createState() => AxonMultiSelectInputState();
}

class AxonMultiSelectInputState extends State<AxonMultiSelectInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final options = controller.getOptions(widget.node.id);

    return FormField<List<String>?>(
      initialValue: widget.node.value?.split(",") ?? [],
      validator: (List<String>? s) {
        var res = controller.validateNode(widget.node.id, s?.join(","));
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.node.label,
              // style:
              //     theme.labelStyle ??
              //     TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
            SizedBox(height: 8),
            ...options.map((option) {
              final isSelected =
                  formFieldState.value?.contains(option.id) ?? false;
              return CheckboxListTile(
                title: Text(option.label),
                value: isSelected,
                // activeColor: theme.checkboxActiveColor,
                onChanged: (checked) {
                  final currentList = List<String>.from(
                    formFieldState.value ?? [],
                  );

                  if (checked == true) {
                    currentList.add(option.id);
                  } else {
                    currentList.remove(option.id);
                  }
                  formFieldState.didChange(currentList);
                },
              );
            }),
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
