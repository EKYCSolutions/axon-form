import 'package:flutter/material.dart';

import 'base_form_field.dart';

class RadioFieldWidget extends BaseFormField {
  const RadioFieldWidget({
    super.key,
    required super.node,
    required super.formState,
    required super.theme,
  });

  @override
  Widget buildField(BuildContext context) {
    final options = formState.getOptionsForField(node.id);
    final selectedValue = formState.getValue(node.fieldName);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          node.label,
          style:
              theme.labelStyle ??
              TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
        ),
        SizedBox(height: 8),
        ...options.map((option) {
          return RadioListTile<String>(
            title: Text(option.label),
            value: option.id,
            groupValue: selectedValue,
            activeColor: theme.radioActiveColor,
            onChanged: (value) => formState.setValue(node.fieldName, value),
          );
        }),
      ],
    );
  }
}
