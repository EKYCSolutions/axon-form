import 'package:axon_form_flutter/axon_form_flutter.dart';

class Validators {
  static String? validate(String? value, List<ValidationRule> rules) {
    for (final rule in rules) {
      final type = rule.type;
      final message = rule.message ?? "Invalid input";

      switch (type) {
        case 'required':
          if (value == null || value.trim().isEmpty) {
            return message;
          }
          break;

        case 'min_length':
          final min = int.tryParse(rule.value.toString()) ?? 0;
          if (value == null || value.length < min) {
            return message;
          }
          break;

        case 'max_length':
          final max = int.tryParse(rule.value.toString()) ?? 999999;
          if (value != null && value.length > max) {
            return message;
          }
          break;

         case 'pattern':
          final pattern = rule.value?.toString();
          if (pattern != null && value != null) {
            final regex = RegExp(pattern);
            if (!regex.hasMatch(value)) {
              return message;
            }
          }
          break;

        default:
          break; // unknown rule -> ignore
      }
    }
    return null; // ✅ passed all rules
  }
}
