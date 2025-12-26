import 'package:flutter/material.dart';
import 'base_form_field.dart';
import '../../models/form_config.dart';
import '../../state/form_state_notifier.dart';
import '../../config/form_theme.dart';

class PasswordFieldWidget extends BaseFormField {
  const PasswordFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    return _PasswordField(node: node, formState: formState, theme: theme);
  }
}

class _PasswordField extends StatefulWidget {
  final FormNode node;
  final FormStateNotifier formState;
  final FormTheme theme;

  const _PasswordField({
    required this.node,
    required this.formState,
    required this.theme,
  });

  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    final baseDecoration = widget.theme.inputDecorationTheme ?? InputDecorationTheme();
    
    return TextFormField(
      initialValue: widget.formState.getValue(widget.node.fieldName) ?? '',
      obscureText: _obscureText,
      decoration: InputDecoration(
        labelText: widget.node.label,
        hintText: widget.node.placeholder,
        labelStyle: widget.theme.labelStyle,
        border: baseDecoration.border ?? OutlineInputBorder(),
        contentPadding: baseDecoration.contentPadding,
        suffixIcon: IconButton(
          icon: Icon(_obscureText ? Icons.visibility : Icons.visibility_off),
          onPressed: () => setState(() => _obscureText = !_obscureText),
        ),
      ),
      onChanged: (value) => widget.formState.setValue(widget.node.fieldName, value),
    );
  }
}
