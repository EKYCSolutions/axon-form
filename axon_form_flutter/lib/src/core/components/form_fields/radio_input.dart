import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonRadioInput extends AxonBaseInput {
  const AxonRadioInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormRadioInputStyle? style;
  final Widget Function(
    BuildContext context,
    AxonFormNode field,
    List<AxonFormNode> options,
    String? selectedValue,
    void Function(String? value) onChanged,
    String? errorText,
  )?
  builder;

  @override
  State<AxonRadioInput> createState() => _AxonRadioInputState();
}

class _AxonRadioInputState extends State<AxonRadioInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final options = controller.getOptions(widget.node.id);
    final nodeValue = controller.getNodeValue(widget.node.id);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormRadioInputStyle>() ??
        AxonFormRadioInputStyle.fallback(context);

    return FormField<String?>(
      key: ValueKey('${widget.node.id}-$nodeValue'),
      initialValue: nodeValue != null ? nodeValue["id"] : nodeValue,
      validator: (String? s) {
        var res = controller.validateNode(widget.node.id, s);
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
            (val) {
              if (val != null) {
                formFieldState.didChange(val);
              }
            },
            formFieldState.errorText,
          );
        }

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
                    title: Text(option.label, style: style.titleStyle),
                    leading: Radio<String>(
                      value: option.id,
                      activeColor: style.activeColor,
                    ),
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
