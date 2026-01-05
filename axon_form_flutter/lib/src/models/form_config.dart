import 'models.dart';
import 'field_type.dart';

class FormConfig {
  final FormLayout layout;
  final List<FormNode> nodes;
  final List<FormEdge> edges;
  // final List<ConditionGroup> conditionGroups;

  FormConfig({
    required this.layout,
    required this.nodes,
    required this.edges,
    // required this.conditionGroups,
  });

  factory FormConfig.fromJson(Map<String, dynamic> json) {
    return FormConfig(
      layout: FormLayout.fromJson(json['layout']),
      nodes: (json['nodes'] as List)
          .map((node) => FormNode.fromJson(node))
          .toList(),
      edges: (json['edges'] as List)
          .map((edge) => FormEdge.fromJson(edge))
          .toList(),
      // conditionGroups: (json['condition_groups'] as List)
      //     .map((group) => ConditionGroup.fromJson(group))
      //     .toList(),
    );
  }
}

class FormLayout {
  final List<FormPage> pages;

  FormLayout({required this.pages});

  factory FormLayout.fromJson(Map<String, dynamic> json) {
    return FormLayout(
      pages: (json['pages'] as List)
          .map((page) => FormPage.fromJson(page))
          .toList(),
    );
  }
}

class FormPage {
  final String id;
  final String title;
  final String description;
  final List<String> fieldIds;

  FormPage({
    required this.id,
    required this.title,
    required this.description,
    required this.fieldIds,
  });

  factory FormPage.fromJson(Map<String, dynamic> json) {
    return FormPage(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      fieldIds: List<String>.from(json['field_ids']),
    );
  }
}

class FormNode {
  final String id;
  final String type;
  final FieldType? fieldType;
  final String fieldName;
  final String label;
  final String? placeholder;
  final List<ValidationRule> validationRules;

  FormNode({
    required this.id,
    required this.type,
    this.fieldType,
    required this.fieldName,
    required this.label,
    this.placeholder,
    required this.validationRules,
  });

  factory FormNode.fromJson(Map<String, dynamic> json) {
    return FormNode(
      id: json['id'],
      type: json['type'],
      fieldType: FieldType.fromString(json['field_type']),
      fieldName: json['field_name'] ?? "",
      label: json['label'],
      placeholder: json['placeholder'],
      validationRules: (json['validation_rules'] as List)
          .map((rule) => ValidationRule.fromJson(rule))
          .toList(),
    );
  }

  /// Get field type value as string
  String? get fieldTypeValue => fieldType?.value;
}

class FormEdge {
  final String id;
  final String label;
  final String sourceNode;
  final String targetNode;
  final String type;

  FormEdge({
    required this.id,
    required this.label,
    required this.sourceNode,
    required this.targetNode,
    required this.type,
  });

  factory FormEdge.fromJson(Map<String, dynamic> json) {
    return FormEdge(
      id: json['id'],
      label: json['label'],
      sourceNode: json['source_node'],
      targetNode: json['target_node'],
      type: json['type'],
    );
  }
}

class ValidationRule {
  final String? type;
  final String? message;
  final int? value;

  ValidationRule({this.type, this.message, this.value});

  factory ValidationRule.fromJson(Map<String, dynamic> json) {
    return ValidationRule(
      type: json['type'],
      message: json['message'],
      value: json['value'],
    );
  }
}
