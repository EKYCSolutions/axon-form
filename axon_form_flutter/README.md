# axon_form_flutter

Flutter plugin for rendering multi-page dynamic forms from JSON configuration, with built-in validation, state management, and customizable UI builders.

## Getting Started

### Requirements

- Flutter `>=3.3.0`
- Dart SDK `^3.8.0`

### Installation

Add the package to your app:

```yaml
dependencies:
  axon_form_flutter:
    path: ../axon_form_flutter
```

Then run:

```bash
flutter pub get
```

## Basic Usage

```dart
import 'dart:convert';

import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class FormScreen extends StatelessWidget {
  const FormScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final config = FormConfig.fromJson(jsonDecode(_formJson));

    return DynamicForm(
      config: config,
      title: 'Registration',
      onSubmit: (data) {
        debugPrint('Submitted: $data');
      },
    );
  }
}

const String _formJson = '''
{
  "layout": {
    "pages": [
      {
        "id": "page_1",
        "title": "Personal Information",
        "description": "Enter your basic details",
        "field_ids": ["first_name", "age", "gender"]
      }
    ]
  },
  "nodes": [
    {
      "id": "first_name",
      "type": "input",
      "field_type": "text",
      "field_name": "firstName",
      "label": "First Name",
      "placeholder": "John",
      "validation_rules": [
        {
          "type": "required",
          "message": "First name is required"
        }
      ]
    },
    {
      "id": "age",
      "type": "input",
      "field_type": "number",
      "field_name": "age",
      "label": "Age",
      "placeholder": "18",
      "validation_rules": [
        {
          "type": "min",
          "value": 1,
          "message": "Age must be greater than 0"
        }
      ]
    },
    {
      "id": "gender",
      "type": "input",
      "field_type": "radio",
      "field_name": "gender",
      "label": "Gender",
      "validation_rules": [
        {
          "type": "required",
          "message": "Please select a gender"
        }
      ]
    },
    {
      "id": "gender_male",
      "type": "value",
      "field_name": "",
      "label": "Male",
      "validation_rules": []
    },
    {
      "id": "gender_female",
      "type": "value",
      "field_name": "",
      "label": "Female",
      "validation_rules": []
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "label": "",
      "source_node": "gender",
      "target_node": "gender_male",
      "type": "has_options"
    },
    {
      "id": "edge_2",
      "label": "",
      "source_node": "gender",
      "target_node": "gender_female",
      "type": "has_options"
    }
  ]
}
''';
```

## Supported Field Types

- `text`
- `number`
- `date`
- `password`
- `radio`
- `dropdown`
- `address_dropdown`
- `checkbox`
- `multi_select`

Note: `file` is defined in `FieldType` but is not currently wired in `FormFieldFactory`.

## Validation Rules

Current runtime validation in `FormStateNotifier` supports:

- `required`
- `minLength`
- `min`
- `max`

The enum also includes `email`, `maxLength`, and `pattern`, but they are not currently enforced by the default validator.

## Customization

You can customize UI via `FormTheme` and `FormBuilders`:

```dart
DynamicForm(
  config: config,
  theme: FormTheme.defaultTheme().copyWith(
    fieldSpacing: 20,
    pagePadding: const EdgeInsets.all(20),
  ),
  builders: FormBuilders(
    progressBuilder: (context, currentPage, totalPages) {
      return LinearProgressIndicator(value: (currentPage + 1) / totalPages);
    },
  ),
)
```

## Main Exports

- `DynamicForm`
- `FormConfig`, `FormPage`, `FormNode`, `FormEdge`
- `FieldType`, `ValidationRuleType`
- `FormStateNotifier`
- `FormTheme`
- `FormBuilders`
- `axon_form_core.dart` exports for lower-level core UI/controller APIs
