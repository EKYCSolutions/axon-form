import 'package:axon_form_flutter/axon_form_flutter.dart';

class AxonFormNode {
  final String id;
  final FieldType? fieldType;
  final String fieldName;
  final String label;
  final String? placeholder;
  final bool isVisible;
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
    required this.isVisible,
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
      isVisible: json['is_visible'],
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

  AxonFormNode copyWith({
    String? id,
    FieldType? fieldType,
    String? fieldName,
    String? label,
    String? placeholder,
    bool? isVisible,
    int? order,
    List<ValidationRule>? validationRules,
    Map<String, dynamic>? configs,
    dynamic value,
  }) {
    return AxonFormNode(
      id: id ?? this.id,
      fieldType: fieldType ?? this.fieldType,
      fieldName: fieldName ?? this.fieldName,
      label: label ?? this.label,
      placeholder: placeholder ?? this.placeholder,
      isVisible: isVisible ?? this.isVisible,
      order: order ?? this.order,
      validationRules: validationRules ?? this.validationRules,
      configs: configs ?? this.configs,
      value: value ?? this.value,
    );
  }
}
