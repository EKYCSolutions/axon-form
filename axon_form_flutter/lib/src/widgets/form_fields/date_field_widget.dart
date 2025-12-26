import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class DateFieldWidget extends BaseFormField {
  const DateFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    final DateTime? selectedDate = formState.getValue(node.fieldName);
    final dateFormat = DateFormat('yyyy-MM-dd');

    return InkWell(
      onTap: () async {
        final DateTime? picked = await showDatePicker(
          context: context,
          initialDate: selectedDate ?? DateTime.now(),
          firstDate: DateTime(1900),
          lastDate: DateTime(2100),
        );
        if (picked != null) {
          formState.setValue(node.fieldName, picked);
        }
      },
      child: InputDecorator(
        decoration: getDecoration().copyWith(suffixIcon: Icon(Icons.calendar_today)),
        child: Text(
          selectedDate != null ? dateFormat.format(selectedDate) : '',
          style: TextStyle(fontSize: 16),
        ),
      ),
    );
  }
}
