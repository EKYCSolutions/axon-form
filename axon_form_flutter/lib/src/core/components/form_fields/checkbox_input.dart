import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonCheckboxInput extends AxonBaseInput {
  const AxonCheckboxInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormCheckboxInputStyle? style;
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    bool? isSelected,
    void Function(bool? value) onChanged,
    String? errorText,
  )?
  builder;

  @override
  State<AxonCheckboxInput> createState() => _AxonCheckboxInputState();
}

class _AxonCheckboxInputState extends State<AxonCheckboxInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormCheckboxInputStyle>() ??
        AxonFormCheckboxInputStyle.fallback(context);

    var value = controller.getNodeValue(widget.node.id);

    return FormField<bool?>(
      initialValue: value != null ? bool.tryParse(value) : false,
      validator: (bool? value) {
        var res = controller.validateNode(widget.node.id, value?.toString());
        return res.error;
      },
      autovalidateMode: AutovalidateMode.onUserInteraction,
      builder: (formFieldState) {
        if (widget.builder != null) {
          return widget.builder!(context, widget.node, formFieldState.value, (
            val,
          ) {
            formFieldState.didChange(val);
          }, formFieldState.errorText);
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CheckboxListTile(
              title: Text(widget.node.label, style: style.titleStyle),
              value: formFieldState.value,
              onChanged: (bool? value) {
                formFieldState.didChange(value);
              },
              controlAffinity: ListTileControlAffinity.leading,
              activeColor: style.activeColor,
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
