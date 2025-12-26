import 'package:flutter/material.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class DropdownFieldWidget extends BaseFormField {
  const DropdownFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    final options = formState.getOptionsForField(node.id);
    final selectedValue = formState.getValue(node.fieldName);

    return DropdownButtonFormField<String>(
      value: selectedValue,
      decoration: getDecoration(),
      items: options.map((option) {
        return DropdownMenuItem<String>(
          value: option.id,
          child: Text(option.label),
        );
      }).toList(),
      onChanged: (value) => formState.setValue(node.fieldName, value),
    );
  }
}
