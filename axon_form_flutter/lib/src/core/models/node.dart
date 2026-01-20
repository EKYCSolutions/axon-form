import 'package:axon_form_flutter/axon_form_flutter.dart';

class AxonFormNode {
  final String id;
  final FieldType? fieldType;
  final String fieldName;
  final String label;
  final String? placeholder;
  final int order;
  final List<ValidationRule> validationRules;
  final Map<String, dynamic>? configs;
  final dynamic value;

  AxonFormNode({
    required this.id,
    required this.fieldName,
    required this.label,
    required this.validationRules,
    required this.order,
    this.fieldType,
    this.value,
    this.placeholder,
    this.configs,
  });

  factory AxonFormNode.fromJson(Map<String, dynamic> json) {
    return AxonFormNode(
      id: json['id'] ?? "",
      fieldType: json['field_type'].runtimeType == int
          ? FieldType.fromInt(json['field_type'])
          : FieldType.fromString(json['field_type']),
      fieldName: json['field_name'] ?? "",
      label: json['label'] ?? "",
      order: json['order'] ?? 0,
      placeholder: json['placeholder'] ?? "",
      value: json["value"],
      validationRules: json['validation_rules'] != null
          ? (json['validation_rules'] as List)
                .map((rule) => ValidationRule.fromJson(rule))
                .toList()
          : [],
      configs: json['configs'] as Map<String, dynamic>?,
    );
  }

  String? get fieldTypeValue => fieldType?.value;
}
