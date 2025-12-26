import 'package:flutter/material.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class MultiSelectFieldWidget extends BaseFormField {
  const MultiSelectFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    final options = formState.getOptionsForField(node.id);
    final List<String> selectedValues = 
        List<String>.from(formState.getValue(node.fieldName) ?? []);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(node.label, style: theme.labelStyle ?? TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
        SizedBox(height: 8),
        ...options.map((option) {
          final isSelected = selectedValues.contains(option.id);
          return CheckboxListTile(
            title: Text(option.label),
            value: isSelected,
            activeColor: theme.checkboxActiveColor,
            onChanged: (checked) {
              final newList = List<String>.from(selectedValues);
              if (checked == true) {
                newList.add(option.id);
              } else {
                newList.remove(option.id);
              }
              formState.setValue(node.fieldName, newList);
            },
          );
        }).toList(),
      ],
    );
  }
}
