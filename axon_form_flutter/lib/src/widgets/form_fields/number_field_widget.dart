import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class NumberFieldWidget extends BaseFormField {
  const NumberFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    return TextFormField(
      initialValue: formState.getValue(node.fieldName)?.toString() ?? '',
      decoration: getDecoration(),
      keyboardType: TextInputType.number,
      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      onChanged: (value) {
        final numValue = int.tryParse(value);
        formState.setValue(node.fieldName, numValue);
      },
    );
  }
}
