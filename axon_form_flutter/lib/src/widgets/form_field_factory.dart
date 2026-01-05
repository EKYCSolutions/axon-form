import 'package:flutter/material.dart';
import '../models/models.dart';
import '../state/state.dart';
import '../config/config.dart';
import 'form_fields/form_fields.dart';

class FormFieldFactory {
  static Widget createField(
    BuildContext context,
    FormNode node,
    FormStateNotifier formState,
    FormTheme theme,
    FormBuilders? builders,
  ) {
    if (node.type != 'input') {
      return SizedBox.shrink();
    }

    // Check for custom builder first
    final customBuilder = builders?.getFieldBuilder(node.fieldType);
    if (customBuilder != null) {
      final customWidget = customBuilder(context, node, formState, theme);
      return _wrapField(context, customWidget, builders);
    }

    // Default field widgets using enum
    Widget field;
    switch (node.fieldType) {
      case FieldType.text:
        field = TextFieldWidget(node: node, formState: formState, theme: theme);
        break;
      case FieldType.number:
        field = NumberFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.date:
        field = DateFieldWidget(node: node, formState: formState, theme: theme);
        break;
      case FieldType.password:
        field = PasswordFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.radio:
        field = RadioFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.dropdown:
        field = DropdownFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.addressDropdown:
        field = DropdownFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.checkbox:
        field = CheckboxFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.multiSelect:
        field = MultiSelectFieldWidget(
          node: node,
          formState: formState,
          theme: theme,
        );
        break;
      case FieldType.file:
        // field = FileFieldWidget(node: node, formState: formState, theme: theme);
        field = Text('Missing field type for: ${node.id}');

        break;
      case FieldType.unknown:
        field = Text('Missing field type for: ${node.id}');
        break;
      default:
        field = Text('Missing field type for: ${node.id}');
    }

    return _wrapField(context, field, builders);
  }

  static Widget _wrapField(
    BuildContext context,
    Widget field,
    FormBuilders? builders,
  ) {
    if (builders?.fieldWrapperBuilder != null) {
      return builders!.fieldWrapperBuilder!(context, field);
    }
    return field;
  }
}
