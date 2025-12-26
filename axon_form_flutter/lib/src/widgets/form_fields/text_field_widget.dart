import 'package:flutter/material.dart';
import 'base_form_field.dart';
import '../../models/models.dart';
import '../../state/state.dart';
import '../../config/config.dart';

class TextFieldWidget extends BaseFormField {
  const TextFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    return TextFormField(
      initialValue: formState.getValue(node.fieldName) ?? '',
      decoration: getDecoration(),
      onChanged: (value) => formState.setValue(node.fieldName, value),
    );
  }
}
