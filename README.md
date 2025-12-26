# Axon Form - Dynamic Form System for Flutter

A powerful and flexible dynamic form generation system for Flutter that creates forms from JSON configuration with built-in state management, validation, and extensive customization options.

## 🎨 Key Features

- 📋 **Dynamic Form Generation** from JSON configuration
- 🎯 **Provider-based State Management** with automatic persistence
- ✅ **Built-in Validation** with customizable rules
- 🎨 **Fully Customizable** - themes, builders, and widgets
- 🔧 **9+ Input Field Types** out of the box
- 📱 **Multi-page Forms** with navigation
- 🚀 **Production Ready** and scalable

## 🏗️ Architecture Overview

### Core Components

1. **JSON Configuration** - Defines form structure, pages, fields, and validation rules
2. **State Management** - Provider-based state management with `FormStateNotifier`
3. **Form Models** - Strongly-typed models for JSON parsing
4. **Field Widgets** - Modular, reusable widgets for each input type
5. **Factory Pattern** - `FormFieldFactory` for dynamic widget creation

### Architecture Diagram

```
JSON Config
    ↓
FormConfig Model
    ↓
FormStateNotifier (Provider)
    ↓
DynamicForm Widget
    ↓
DynamicFormPage → FormFieldFactory → Individual Field Widgets
```

## 🎯 State Management Approach

### FormStateNotifier (ChangeNotifier)

The `FormStateNotifier` class is the heart of our state management:

- **Centralized Data Storage**: All form values stored in `_formData` Map
- **Error Management**: Field-level error tracking in `_errors` Map
- **Validation**: Built-in validation rules (required, min_length, min, max)
- **Persistence**: State persists across page navigation
- **Reactive Updates**: `notifyListeners()` triggers UI rebuilds

### Key Methods

```dart
// Get/Set values
formState.getValue(fieldName)
formState.setValue(fieldName, value)

// Validation
formState.validateField(node)
formState.validatePage(fieldIds)

// Get options for dropdown/radio/multi-select
formState.getOptionsForField(fieldId)
```

## 📋 Supported Input Field Types

| Field Type | Enum Value | JSON Value | Widget | Description |
|------------|------------|------------|--------|-------------|
| Text | `FieldType.text` | `"text"` | TextFieldWidget | Single-line text input |
| Number | `FieldType.number` | `"number"` | NumberFieldWidget | Numeric input only |
| Date | `FieldType.date` | `"date"` | DateFieldWidget | Date picker |
| Password | `FieldType.password` | `"password"` | PasswordFieldWidget | Obscured text with visibility toggle |
| Radio | `FieldType.radio` | `"radio"` | RadioFieldWidget | Single selection from options |
| Dropdown | `FieldType.dropdown` | `"dropdown"` | DropdownFieldWidget | Dropdown selection |
| Checkbox | `FieldType.checkbox` | `"checkbox"` | CheckboxFieldWidget | Single boolean checkbox |
| Multi-select | `FieldType.multiSelect` | `"multi_select"` | MultiSelectFieldWidget | Multiple checkbox selections |
| File | `FieldType.file` | `"file"` | FileFieldWidget | File picker |

## 🚀 Getting Started

### Installation

Add to your `pubspec.yaml`:

```yaml
dependencies:
  provider: ^6.1.1
  file_picker: ^6.1.1
  intl: ^0.18.1
```

### Basic Usage

```dart
import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:axon_form/axon_form.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: rootBundle.loadString('assets/example.json'),
      builder: (context, snapshot) {
        if (!snapshot.hasData) return CircularProgressIndicator();
        
        final config = FormConfig.fromJson(jsonDecode(snapshot.data!));
        
        return DynamicForm(
          config: config,
          onSubmit: (data) {
            print('Form submitted: $data');
          },
        );
      },
    );
  }
}
```

### Import Options

#### Simple Import (Recommended)
```dart
// Import everything you need
import 'package:axon_form/axon_form.dart';
```

#### Selective Imports
```dart
// Import only what you need
import 'package:axon_form/axon_form.dart' show DynamicForm, FormConfig, FieldType;
```

#### Internal Package Structure (for contributors)
```dart
// Models
import 'package:axon_form/src/models/models.dart';

// Configuration
import 'package:axon_form/src/config/config.dart';

// State
import 'package:axon_form/src/state/state.dart';

// Widgets
import 'package:axon_form/src/widgets/widgets.dart';
```

## 📝 JSON Configuration Structure

### Complete Example

```json
{
  "layout": {
    "pages": [
      {
        "id": "page1",
        "title": "Personal Info",
        "description": "Enter your details",
        "field_ids": ["field1", "field2"]
      }
    ]
  },
  "nodes": [
    {
      "id": "field1",
      "type": "input",
      "field_type": "text",
      "field_name": "first-name",
      "label": "First Name",
      "placeholder": "Enter first name",
      "validation_rules": [
        {
          "type": "required",
          "message": "First name is required"
        }
      ]
    }
  ],
  "edges": [],
  "condition_groups": []
}
```

### Node Types

- **input**: Interactive form field
- **value**: Option for dropdown/radio/multi-select

### Validation Rules

```json
{
  "type": "required",
  "message": "This field is required"
}
```

```json
{
  "type": "min_length",
  "value": 8,
  "message": "Must be at least 8 characters"
}
```

```json
{
  "type": "min",
  "value": 18,
  "message": "Must be at least 18"
}
```

## 🔧 Adding a New Input Field Type

### Step 1: Add to FieldType Enum

```dart
// lib/src/models/field_type.dart
enum FieldType {
  // ...existing types...
  email('email'),
  phone('phone'),
  url('url');
  
  // ...existing code...
}
```

### Step 2: Create the Widget

```dart
// lib/src/widgets/form_fields/email_field_widget.dart
import 'package:flutter/material.dart';
import 'base_form_field.dart';

class EmailFieldWidget extends BaseFormField {
  const EmailFieldWidget({
    Key? key,
    required FormNode node,
    required FormStateNotifier formState,
    required FormTheme theme,
  }) : super(key: key, node: node, formState: formState, theme: theme);

  @override
  Widget buildField(BuildContext context) {
    return TextFormField(
      initialValue: formState.getValue(node.fieldName) ?? '',
      decoration: getDecoration().copyWith(
        prefixIcon: Icon(Icons.email),
      ),
      keyboardType: TextInputType.emailAddress,
      onChanged: (value) => formState.setValue(node.fieldName, value),
    );
  }
}
```

### Step 3: Register in Factory

```dart
// lib/src/widgets/form_field_factory.dart
import 'form_fields/email_field_widget.dart';

class FormFieldFactory {
  static Widget createField(...) {
    // ...existing code...
    switch (node.fieldType) {
      // ...existing cases...
      case FieldType.email:
        field = EmailFieldWidget(node: node, formState: formState, theme: theme);
        break;
      // ...existing code...
    }
  }
}
```

### Step 4: Use in JSON

```json
{
  "id": "email_field",
  "type": "input",
  "field_type": "email",
  "field_name": "user-email",
  "label": "Email Address",
  "validation_rules": [
    {
      "type": "required",
      "message": "Email is required"
    }
  ]
}
```

## 🎨 Customization

### Custom Field Builders with Enum

```dart
import 'package:axon_form/axon_form.dart';

final customBuilders = FormBuilders(
  // Using enum for type safety
  fieldBuilders: {
    FieldType.text: (context, node, formState) {
      return TextField(
        decoration: InputDecoration(
          labelText: node.label,
          prefixIcon: Icon(Icons.person),
          border: OutlineInputBorder(),
        ),
        onChanged: (value) => formState.setValue(node.fieldName, value),
      );
    },
    FieldType.number: (context, node, formState) {
      return TextField(
        decoration: InputDecoration(
          labelText: node.label,
          prefixIcon: Icon(Icons.numbers),
          border: OutlineInputBorder(),
        ),
        keyboardType: TextInputType.number,
        onChanged: (value) => formState.setValue(node.fieldName, int.tryParse(value)),
      );
    },
  },
);

DynamicForm(
  config: config,
  builders: customBuilders,
  onSubmit: (data) => print(data),
);
```

### Custom Field Builders (Legacy String Support)

```dart
final customBuilders = FormBuilders(
  // Legacy string-based builders still supported
  fieldBuildersLegacy: {
    'email': (context, node, formState) {
      return TextField(
        decoration: InputDecoration(
          labelText: node.label,
          prefixIcon: Icon(Icons.email),
          border: OutlineInputBorder(),
        ),
        keyboardType: TextInputType.emailAddress,
        onChanged: (value) => formState.setValue(node.fieldName, value),
      );
    },
  },
);
```

### Complete Customization Example

```dart
import 'package:flutter/material.dart';
import 'package:axon_form/axon_form.dart';

class CustomFormScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final config = FormConfig.fromJson(jsonData);
    
    final customTheme = FormTheme(
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        fillColor: Colors.blue[50],
        filled: true,
      ),
      primaryButtonStyle: ElevatedButton.styleFrom(
        backgroundColor: Colors.indigo,
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      ),
    );

    final customBuilders = FormBuilders(
      fieldBuilders: {
        'custom_type': (context, node, formState) {
          return YourCustomWidget(node: node, formState: formState);
        },
      },
      navigationBuilder: (context, currentPage, totalPages, onNext, onPrevious, onSubmit) {
        return CustomNavigationWidget(
          currentPage: currentPage,
          totalPages: totalPages,
          onNext: onNext,
          onPrevious: onPrevious,
          onSubmit: onSubmit,
        );
      },
      fieldWrapperBuilder: (context, field) {
        return AnimatedContainer(
          duration: Duration(milliseconds: 300),
          margin: EdgeInsets.symmetric(vertical: 8),
          padding: EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: field,
        );
      },
    );

    return DynamicForm(
      config: config,
      theme: customTheme,
      builders: customBuilders,
      showAppBar: true,
      title: 'Registration Form',
      onSubmit: (data) {
        print('Form submitted: $data');
        // Handle form submission
      },
    );
  }
}
```

## 🎯 Advanced Usage

### Without AppBar

```dart
DynamicForm(
  config: config,
  showAppBar: false,
  onSubmit: (data) => print(data),
);
```

### Custom AppBar Actions

```dart
DynamicForm(
  config: config,
  title: 'Survey Form',
  appBarActions: [
    IconButton(
      icon: Icon(Icons.save),
      onPressed: () => _saveDraft(),
    ),
    IconButton(
      icon: Icon(Icons.info),
      onPressed: () => _showHelp(),
    ),
  ],
  onSubmit: (data) => print(data),
);
```

### Accessing Form State

```dart
final formState = Provider.of<FormStateNotifier>(context, listen: false);

// Get current values
final firstName = formState.getValue('first-name');

// Set values programmatically
formState.setValue('email', 'user@example.com');

// Get all form data
final allData = formState.getAllData();

// Clear form
formState.clear();
```

## 📦 Package Structure

```
lib/
├── axon_form.dart                    # Main export (use this)
└── src/
    ├── axon_form_internal.dart       # Internal barrel file
    ├── dynamic_form.dart             # Main form widget
    ├── models/
    │   ├── models.dart               # Models barrel file
    │   ├── form_config.dart
    │   └── field_type.dart
    ├── config/
    │   ├── config.dart               # Config barrel file
    │   ├── form_theme.dart
    │   └── form_builders.dart
    ├── state/
    │   ├── state.dart                # State barrel file
    │   └── form_state_notifier.dart
    └── widgets/
        ├── widgets.dart              # Widgets barrel file
        ├── form_fields/
        │   ├── form_fields.dart      # Form fields barrel file
        │   ├── base_form_field.dart
        │   ├── text_field_widget.dart
        │   └── ... (other fields)
        ├── form_field_factory.dart
        ├── dynamic_form_page.dart
        ├── default_navigation.dart
        └── default_progress.dart
```

### What to Import

| Use Case | Import Statement |
|----------|-----------------|
| **Basic usage** | `import 'package:axon_form/axon_form.dart';` |
| **Custom field widgets** | `import 'package:axon_form/axon_form.dart';` |
| **Advanced customization** | `import 'package:axon_form/axon_form.dart';` |
| **Contributing to package** | `import 'package:axon_form/src/axon_form_internal.dart';` |

## 🎨 Customization

### Complete Example with Organized Imports

```dart
import 'package:flutter/material.dart';
import 'package:axon_form/axon_form.dart';

class CustomFormScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // All classes are available from single import
    final config = FormConfig.fromJson(jsonData);
    
    final customTheme = FormTheme(
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      primaryButtonStyle: ElevatedButton.styleFrom(
        backgroundColor: Colors.indigo,
      ),
    );

    final customBuilders = FormBuilders(
      fieldBuilders: {
        FieldType.text: (context, node, formState) {
          return CustomTextField(node: node, formState: formState);
        },
      },
    );

    return DynamicForm(
      config: config,
      theme: customTheme,
      builders: customBuilders,
      onSubmit: (data) => print(data),
    );
  }
}
```

## 🔌 Plugin Architecture

The Axon Form plugin is designed to be:

1. **Extensible** - Easy to add new field types
2. **Customizable** - Full control over appearance and behavior
3. **Reusable** - Use across multiple projects
4. **Maintainable** - Clean separation of concerns

### Adding to Your Project

```yaml
dependencies:
  axon_form:
    path: ../axon_form_flutter
```

Or publish to pub.dev:

```yaml
dependencies:
  axon_form: ^1.0.0
```