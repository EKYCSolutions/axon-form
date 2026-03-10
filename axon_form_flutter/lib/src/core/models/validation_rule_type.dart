/// Enum representing all supported field types in the form
enum ValidationRuleType {
  required,
  email,
  minLength,
  maxLength,
  pattern,
  min,
  max,
  unknown;

  /// Convert string to ValidationRuleType enum
  static ValidationRuleType fromString(String? value) {
    if (value == null) return ValidationRuleType.unknown;

    switch (value) {
      case "required":
        return ValidationRuleType.required;
      case "email":
        return ValidationRuleType.email;
      case "minLength":
        return ValidationRuleType.minLength;
      case "maxLength":
        return ValidationRuleType.maxLength;
      case "pattern":
        return ValidationRuleType.pattern;
      case "min":
        return ValidationRuleType.min;
      case "max":
        return ValidationRuleType.max;
      case "unknown":
        return ValidationRuleType.unknown;
      default:
        return ValidationRuleType.unknown;
    }
  }

  /// Convert golang ValidationRuleType iota to ValidationRuleType enum
  static ValidationRuleType fromInt(int value) {
    switch (value) {
      case 0:
        return ValidationRuleType.required;
      case 1:
        return ValidationRuleType.email;
      case 2:
        return ValidationRuleType.minLength;
      case 3:
        return ValidationRuleType.maxLength;
      case 4:
        return ValidationRuleType.pattern;
      case 5:
        return ValidationRuleType.min;
      case 6:
        return ValidationRuleType.max;
      case 7:
        return ValidationRuleType.unknown;
      default:
        return ValidationRuleType.unknown;
    }
  }

  /// Get string value of the ValidationRuleType enum
  String get value {
    switch (this) {
      case ValidationRuleType.required:
        return "required";
      case ValidationRuleType.email:
        return "email";
      case ValidationRuleType.minLength:
        return "minLength";
      case ValidationRuleType.maxLength:
        return "maxLength";
      case ValidationRuleType.pattern:
        return "pattern";
      case ValidationRuleType.min:
        return "min";
      case ValidationRuleType.max:
        return "max";
      case ValidationRuleType.unknown:
        return "unknown";
    }
  }
}
