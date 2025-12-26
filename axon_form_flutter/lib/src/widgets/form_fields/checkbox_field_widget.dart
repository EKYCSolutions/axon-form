import 'package:flutter/material.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class CheckboxFieldWidget extends BaseFormField {
  const CheckboxFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    final value = formState.getValue(node.fieldName) ?? false;

    return CheckboxListTile(
      title: Text(node.label),
      value: value,
      activeColor: theme.checkboxActiveColor,
      onChanged: (newValue) => formState.setValue(node.fieldName, newValue ?? false),
      controlAffinity: ListTileControlAffinity.leading,
    );
  }
}
