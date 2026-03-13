import 'package:axon_form_flutter/axon_form_flutter.dart';

class ValidationRule {
  final ValidationRuleType? type;
  final String? message;
  final int? value;

  ValidationRule({this.type, this.message, this.value});

  factory ValidationRule.fromJson(Map<String, dynamic> json) {
    return ValidationRule(
      type: json['type'].runtimeType == int
          ? ValidationRuleType.fromInt(json['type'])
          : ValidationRuleType.fromString(json['type']),
      message: json['message'],
      value: json['value'] != null && json['value'] is int
          ? json['value']
          : null,
    );
  }
}
