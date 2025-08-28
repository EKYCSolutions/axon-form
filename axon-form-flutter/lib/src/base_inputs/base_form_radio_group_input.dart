import 'package:axon_form_flutter/src/models/model.dart';
import 'package:axon_form_flutter/src/shared_widgets.dart/shared_widget.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';


enum FormCheckMarkPosition { left, right }

class BaseFormRadioGroupOption<T> {
  const BaseFormRadioGroupOption({
    required this.value,
    required this.icon,
    required this.label,
    this.description,
  });

  final T value;
  final String? description;
  final Widget icon;
  final Widget label;
}

class _OptionCard extends StatelessWidget {
  const _OptionCard({
    required this.option,
    required this.selected,
    required this.onSelected,
    required this.compact,
    required this.checkMarkPosition,
  });

  final Node option;
  // final BaseFormRadioGroupOption option;
  final bool selected;
  final Function()? onSelected;
  final bool compact;
  final FormCheckMarkPosition checkMarkPosition;

  @override
  Widget build(BuildContext context) {
    return CupertinoButton(
      onPressed: onSelected,
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Container(
        height: compact ? 56 : 80,
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 8),
       
        child: Row(
          children: [
            if (checkMarkPosition == FormCheckMarkPosition.left) ...[
              BaseCheckbox(checked: selected),
              const SizedBox(width: 8),
            ],
            // if (!compact) ...[
            //   Container(
            //     height: 56,
            //     width: 56,
            //     decoration: BoxDecoration(
            //       borderRadius: BorderRadius.circular(100),
            //       // color: context.colorScheme.primary.withOpacity(0.1),
            //     ),
            //     alignment: Alignment.center,
            //     child: option.icon,
            //   ),
            //   const SizedBox(width: 8),
            // ],
            Text(option.label??"LABEL",),
            
            const Spacer(),
            if (checkMarkPosition == FormCheckMarkPosition.right)
              BaseCheckbox(checked: selected),
          ],
        ),
      ),
    );
  }
}

class BaseFormRadioGroupInput extends StatelessWidget {
  const BaseFormRadioGroupInput({
    super.key,
    required this.options,
    this.labelText,
    this.onSelected,
    this.initialValue,
    this.autoValidateMode = AutovalidateMode.onUserInteraction,
    this.enabled = true,
    this.validator,
    this.compact = false,
    this.required = false,
    this.checkMarkPosition = FormCheckMarkPosition.right,
  });

  final bool compact;
  final FormCheckMarkPosition checkMarkPosition;
  final List<Node> options;
  // final List<BaseFormRadioGroupOption<T>> options;
  final String? labelText;
  final Function(Node?)? onSelected;
  final Node? initialValue;
  final AutovalidateMode? autoValidateMode;
  final bool enabled;
  final bool required;
  final String? Function(Node?)? validator;

  @override
  Widget build(BuildContext context) {
    return FormField<Node>(
      validator: (Node? s) {
        // if ((s == null || s.id == '') && required) {
        //   return "required";
        // }
        return validator?.call(s);
      },
      initialValue: initialValue,
      autovalidateMode: autoValidateMode,
      enabled: enabled,
      builder: (FormFieldState<Node> field) {
        return InputDecorator(
          decoration: InputDecoration(
            labelText: labelText,
            contentPadding: const EdgeInsets.only(top: 10.0, bottom: 0.0),
            border: InputBorder.none,
            errorText: field.errorText,
          ),
          child: Column(
            children:
                options
                    .map(
                      (option) => _OptionCard(
                        option: option,
                        selected: field.value == option,
                        checkMarkPosition: checkMarkPosition,
                        compact: compact,
                        onSelected:
                            enabled
                                ? () {
                                  final choice =
                                      field.value != option
                                          ? option
                                          : null;
                                  field.didChange(choice);
                                  onSelected?.call(choice);
                                }
                                : null,
                      ),
                    )
                    .toList(),
          ),
        );
      },
    );
  }
}
