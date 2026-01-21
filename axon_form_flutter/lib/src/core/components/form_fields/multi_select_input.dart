import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonMultiSelectInput extends AxonBaseInput {
  const AxonMultiSelectInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormMultiSelectInputStyle? style;
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    List<AxonFormNode> options,
    List<String>? selectedValue,
    void Function(AxonFormNode option, bool? checked) onChanged,
    String? errorText,
  )?
  builder;

  @override
  State<AxonMultiSelectInput> createState() => AxonMultiSelectInputState();
}

class AxonMultiSelectInputState extends State<AxonMultiSelectInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final options = controller.getOptions(widget.node.id);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormMultiSelectInputStyle>() ??
        AxonFormMultiSelectInputStyle.fallback(context);

    return FormField<List<String>?>(
      initialValue: widget.node.value?.split(",") ?? [],
      validator: (List<String>? s) {
        var res = controller.validateNode(widget.node.id, s?.join(","));
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        if (widget.builder != null) {
          return widget.builder!(
            context,
            widget.node,
            options,
            formFieldState.value,
            (option, checked) {
              final currentList = List<String>.from(formFieldState.value ?? []);

              if (checked == true) {
                currentList.add(option.id);
              } else {
                currentList.remove(option.id);
              }
              formFieldState.didChange(currentList);
            },
            formFieldState.errorText,
          );
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.node.label),
            SizedBox(height: 8),
            ...options.map((option) {
              final isSelected =
                  formFieldState.value?.contains(option.id) ?? false;
              return CheckboxListTile(
                title: Text(option.label, style: style.titleStyle),
                value: isSelected,
                activeColor: style.activeColor,
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
