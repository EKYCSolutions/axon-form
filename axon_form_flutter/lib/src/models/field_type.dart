/// Enum representing all supported field types in the form
enum FieldType {
  text,
  number,
  date,
  password,
  radio,
  dropdown,
  addressDropdown,
  checkbox,
  multiSelect,
  file,
  unknown;

  /// Convert string to FieldType enum
  static FieldType fromString(String? value) {
    if (value == null) return FieldType.unknown;

    switch (value) {
      case 'text':
        return FieldType.text;
      case 'number':
        return FieldType.number;
      case 'date':
        return FieldType.date;
      case 'password':
        return FieldType.password;
      case 'radio':
        return FieldType.radio;
      case 'dropdown':
        return FieldType.dropdown;
      case 'address_dropdown':
        return FieldType.addressDropdown;
      case 'checkbox':
        return FieldType.checkbox;
      case 'multi_select':
        return FieldType.multiSelect;
      case 'file':
        return FieldType.file;
      default:
        return FieldType.unknown;
    }
  }

  /// Get string value of the FieldType enum
  String get value {
    switch (this) {
      case FieldType.text:
        return 'text';
      case FieldType.number:
        return 'number';
      case FieldType.date:
        return 'date';
      case FieldType.password:
        return 'password';
      case FieldType.radio:
        return 'radio';
      case FieldType.dropdown:
        return 'dropdown';
      case FieldType.addressDropdown:
        return 'address_dropdown';
      case FieldType.checkbox:
        return 'checkbox';
      case FieldType.multiSelect:
        return 'multi_select';
      case FieldType.file:
        return 'file';
      case FieldType.unknown:
        return 'unknown';
    }
  }
}
