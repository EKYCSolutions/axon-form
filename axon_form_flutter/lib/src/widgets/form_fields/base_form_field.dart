import 'package:flutter/material.dart';
import '../../models/models.dart';
import '../../state/state.dart';
import '../../config/config.dart';

abstract class BaseFormField extends StatelessWidget {
  final FormNode node;
  final FormStateNotifier formState;
  final FormTheme theme;

  const BaseFormField({
    Key? key,
    required this.node,
    required this.formState,
    required this.theme,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final errorText = formState.getError(node.fieldName);

    return Padding(
      padding: theme.fieldPadding ?? EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          buildField(context),
          if (errorText != null)
            Padding(
              padding: const EdgeInsets.only(top: 4.0),
              child: buildError(context, errorText),
            ),
        ],
      ),
    );
  }

  Widget buildField(BuildContext context);

  Widget buildError(BuildContext context, String error) {
    return Text(
      error,
      style: theme.errorStyle ?? TextStyle(color: Colors.red, fontSize: 12),
    );
  }

  InputDecoration getDecoration() {
    final baseDecoration = theme.inputDecorationTheme ?? InputDecorationTheme();

    return InputDecoration(
      labelText: node.label,
      hintText: node.placeholder,
      labelStyle: theme.labelStyle,
      border: baseDecoration.border ?? OutlineInputBorder(),
      enabledBorder: baseDecoration.enabledBorder,
      focusedBorder: baseDecoration.focusedBorder,
      errorBorder: baseDecoration.errorBorder,
      contentPadding: baseDecoration.contentPadding,
    );
  }
}
