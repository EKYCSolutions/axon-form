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
  phoneNumber,
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
      case 'phone_number':
        return FieldType.phoneNumber;
      default:
        return FieldType.unknown;
    }
  }

  /// Convert golang FieldType iota to FieldType enum
  static FieldType fromInt(int value) {
    switch (value) {
      case 0:
        return FieldType.text;
      case 1:
        return FieldType.number;
      case 2:
        return FieldType.date;
      case 3:
        return FieldType.multiSelect;
      case 4:
        return FieldType.radio;
      case 5:
        return FieldType.dropdown;
      case 6:
        return FieldType.checkbox;
      case 7:
        return FieldType.file;
      case 8:
        return FieldType.password;
      case 9:
        return FieldType.addressDropdown;
      case 10:
        return FieldType.phoneNumber;
      case 11:
        return FieldType.unknown;
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
      case FieldType.phoneNumber:
        return 'phone_number';
      case FieldType.unknown:
        return 'unknown';
    }
  }
}
