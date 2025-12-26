import 'package:flutter/material.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class RadioFieldWidget extends BaseFormField {
  const RadioFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    final options = formState.getOptionsForField(node.id);
    final selectedValue = formState.getValue(node.fieldName);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(node.label, style: theme.labelStyle ?? TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
        SizedBox(height: 8),
        ...options.map((option) {
          return RadioListTile<String>(
            title: Text(option.label),
            value: option.id,
            groupValue: selectedValue,
            activeColor: theme.radioActiveColor,
            onChanged: (value) => formState.setValue(node.fieldName, value),
          );
        }).toList(),
      ],
    );
  }
}
