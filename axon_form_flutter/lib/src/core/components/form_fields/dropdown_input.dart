import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class AxonDropdownInput extends AxonBaseInput {
  const AxonDropdownInput({
    super.key,
    required super.node,
    this.style,
    this.builder,
  });

  final AxonFormDropdownInputStyle? style;
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
  State<AxonDropdownInput> createState() => _AxonDropdownInputState();
}

class _AxonDropdownInputState extends State<AxonDropdownInput> {
  @override
  Widget build(BuildContext context) {
    final controller = widget.getController(context);
    final options = controller.getOptions(widget.node.id);

    var style =
        widget.style ??
        Theme.of(context).extension<AxonFormDropdownInputStyle>() ??
        AxonFormDropdownInputStyle.fallback(context);

    return FormField<String?>(
      initialValue: widget.node.value,
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
            DropdownButton<String>(
              elevation: style.elevation,
              style: style.style,
              underline: style.underline,
              icon: style.icon,
              iconDisabledColor: style.iconDisabledColor,
              iconEnabledColor: style.iconEnabledColor,
              iconSize: style.iconSize,
              isDense: style.isDense,
              isExpanded: style.isExpanded,
              itemHeight: style.itemHeight,
              menuWidth: style.menuWidth,
              focusColor: style.focusColor,
              autofocus: style.autofocus,
              dropdownColor: style.dropdownColor,
              menuMaxHeight: style.menuMaxHeight,
              enableFeedback: style.enableFeedback,
              alignment: style.alignment,
              borderRadius: style.borderRadius,
              padding: style.padding,
              barrierDismissible: style.barrierDismissible,
              value: formFieldState.value,
              hint: Text(widget.node.label),
              selectedItemBuilder: (context) => options.map((option) {
                return style.selectedItemBuilder != null
                    ? style.selectedItemBuilder!(context, option.label)
                    : Text(option.label);
              }).toList(),
              items: options.map((option) {
                return DropdownMenuItem<String>(
                  value: option.id,
                  child: style.itemBuilder != null
                      ? style.itemBuilder!(
                          context,
                          option.label,
                          formFieldState.value == option.id,
                        )
                      : Text(option.label),
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
