# Axon Form - Dynamic Form System for Flutter

A powerful and flexible dynamic form generation system for Flutter that renders forms from Axon JSON using a native FFI core.

## 🎨 Key Features

- 📋 **Dynamic Form Generation** from JSON configuration
- 🎯 **Provider-based State Management** with `AxonFormProvider`
- ✅ **Built-in Validation** via native Axon engine
- 🎨 **Customizable Rendering** with page/field/navigation builders
- 🔧 **10 Input Field Types** out of the box
- 📱 **Multi-page Forms** with default or custom navigation
- 🚀 **Production-oriented FFI Architecture**

## 🏗️ Architecture Overview

### Core Components

1. **JSON Configuration** - Defines pages, nodes, edges, and conditions
2. **Native Core (FFI)** - Handles graph init, validation, visibility, and values
3. **State Management** - `AxonFormProvider` + `ChangeNotifier`
4. **Rendering Layer** - `AxonForm` + page/field builders
5. **Field Widgets** - Modular widgets for each field type

### Architecture Diagram

```text
JSON Config
    ↓
AxonFormFFI.initialize()
    ↓
AxonFormGraph + AxonFormProvider
    ↓
AxonForm / FormBuilder / PageBuilder
    ↓
AxonFormFieldBuilder
    ↓
Field Widgets (text, number, date, ...)
```

## 🎯 State Management Approach

### AxonFormProvider (ChangeNotifier)

`AxonFormProvider` is the form state orchestrator:

- Stores graph/page state and current page index
- Retrieves field values through native core
- Triggers field/page validation through native core
- Handles dynamic visibility updates through native event listeners
- Notifies UI consumers reactively

### AxonFormController

`AxonFormController` is the public controller wrapper:

```dart
controller.getFieldValue('field_id');
controller.setFieldValue('field_id', value);
controller.validatePage('page_id');
controller.getOptions('field_id');
controller.nextPage();
controller.prevPage();
```

## 📋 Supported Input Field Types

| Field Type | Enum Value | JSON Value | Widget | Description |
|------------|------------|------------|--------|-------------|
| Text | `FieldType.text` | `"text"` | `AxonTextInput` | Single-line text input |
| Number | `FieldType.number` | `"number"` | `AxonNumberInput` | Digits-only numeric input |
| Date | `FieldType.date` | `"date"` | `AxonDateInput` | Date picker |
| Password | `FieldType.password` | `"password"` | `AxonPasswordInput` | Obscured input with toggle |
| Radio | `FieldType.radio` | `"radio"` | `AxonRadioInput` | Single selection from options |
| Dropdown | `FieldType.dropdown` | `"dropdown"` | `AxonDropdownInput` | Dropdown selection |
| Address Dropdown | `FieldType.addressDropdown` | `"address_dropdown"` | `AxonAddressDropdownInput` | Cascading address selection |
| Checkbox | `FieldType.checkbox` | `"checkbox"` | `AxonCheckboxInput` | Boolean input |
| Multi-select | `FieldType.multiSelect` | `"multi_select"` | `AxonMultiSelectInput` | Multiple option selection |
| File | `FieldType.file` | `"file"` | `AxonFileInput` | File picker input |

## 🚀 Getting Started

### Requirements

- Flutter `>=3.3.0`
- Dart SDK `^3.8.0`

### Installation

Add to your app `pubspec.yaml`:

```yaml
dependencies:
  axon_form_flutter:
    path: ../axon_form_flutter
```

Then run:

```bash
flutter pub get
```

### iOS Setup

The native Axon core ships as a compiled `.xcframework` and is only referenced
through Dart FFI (`dart:ffi` symbol lookups) rather than any Swift/Objective-C
import. Xcode's linker has no static reference to those symbols, so its default
dead code stripping will strip them out of the release binary and FFI calls will
fail to resolve at runtime unless it's disabled.

In Xcode, open the iOS project (`ios/Runner.xcworkspace`) and for the **Runner**
target:

1. Go to **Build Settings** → switch to the **Combined** tab → search for `strip`.
2. Under **Linking - General**, set **Dead Code Stripping** to **No** for all
   configurations (Debug, Profile, Release).

Without this, the app may build and run fine in Debug but fail to find the native
Axon symbols in Release/Profile builds (e.g. App Store or TestFlight builds).

### Basic Usage

```dart
import 'dart:convert';
import 'package:axon_form_flutter/axon_form_flutter.dart';
import 'package:flutter/material.dart';

class MyFormScreen extends StatelessWidget {
  const MyFormScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: DefaultAssetBundle.of(context).loadString('assets/example.json'),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (!snapshot.hasData) {
          return const Center(child: Text('Error loading form JSON'));
        }

        final formJson = jsonDecode(snapshot.data!) as Map<String, dynamic>;

        return AxonForm.json(
          formJson,
          onSubmit: (result) {
            debugPrint('Form submitted: $result');
          },
        );
      },
    );
  }
}
```

### Alternative Constructor

```dart
AxonForm.file(
  'assets/example.json',
  onSubmit: (result) => debugPrint('$result'),
)
```

## 📝 JSON Configuration Structure

### Expected Top-level Keys

- `layout.pages`
- `nodes`
- `edges`
- optional `condition_groups`
- optional `address` (for `address_dropdown`)

### Minimal Example

```json
{
  "layout": {
    "pages": [
      {
        "id": "p1",
        "order": 0,
        "title": "Basic Info",
        "description": "Enter your details",
        "field_ids": ["f_name", "f_gender"]
      }
    ]
  },
  "nodes": [
    {
      "id": "p1",
      "type": "page",
      "field_name": "",
      "field_type": "",
      "label": ""
    },
    {
      "id": "f_name",
      "type": "input",
      "field_type": "text",
      "field_name": "name",
      "label": "Full Name",
      "validation_rules": [
        {"type": "required", "message": "Name is required"}
      ]
    },
    {
      "id": "f_gender",
      "type": "input",
      "field_type": "radio",
      "field_name": "gender",
      "label": "Gender"
    },
    {"id": "opt_m", "type": "value", "label": "Male", "value": "m"},
    {"id": "opt_f", "type": "value", "label": "Female", "value": "f"}
  ],
  "edges": [
    {
      "id": "e1",
      "source_node": "f_gender",
      "target_node": "opt_m",
      "type": "has_options"
    },
    {
      "id": "e2",
      "source_node": "f_gender",
      "target_node": "opt_f",
      "type": "has_options"
    }
  ]
}
```

Full example: `example/assets/example.json`.

## ✅ Validation Rules

Validation rule enums available in Flutter:

- `required`
- `email`
- `minLength`
- `maxLength`
- `pattern`
- `min`
- `max`

Validation is executed by native Axon core during:

- field updates
- page transitions
- submit

## 🎨 Customization

### Custom Field / Page / Navigation Builders

```dart
AxonForm.json(
  formJson,
  onSubmit: (result) {},
  fieldBuilder: (context, node) {
    if (node.id == 'f_name') {
      return Text('Custom field for ${node.label}');
    }
    return null; // fallback to built-in field
  },
  pageBuilder: (context, page, nodes, defaultFieldBuilder) {
    return null; // fallback to built-in page
  },
  pageNavigatorBuilder: (context, pages, currentPage, pageCount, next, prev) {
    return null; // fallback to default navigator
  },
)
```

### ThemeExtension-based Styling

```dart
MaterialApp(
  theme: ThemeData(
    extensions: const [
      AxonFormTextInputStyle(
        decoration: InputDecoration(border: OutlineInputBorder()),
      ),
      AxonFormNumberInputStyle(
        decoration: InputDecoration(border: OutlineInputBorder()),
      ),
      AxonFormDateInputStyle(
        inputDecoration: InputDecoration(border: OutlineInputBorder()),
      ),
      AxonFormDropdownInputStyle(isExpanded: true),
    ],
  ),
  home: AxonForm.json(formJson, onSubmit: (result) {}),
)
```

## 📦 Package Exports

Import once:

```dart
import 'package:axon_form_flutter/axon_form_flutter.dart';
```

This includes:

- `AxonForm`, `AxonFormController`
- models (`AxonFormNode`, `AxonFormPage`, `AxonFormGraph`)
- enums (`FieldType`, `ValidationRuleType`)
- built-in field widgets
- style extensions

## 🧪 Run the Example

```bash
cd example
flutter pub get
flutter run
```
