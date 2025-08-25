
class Node {
  final String? id;
  final String? type; // input | value
  final String? fieldType; // text | dropdown | radio | file
  final String? fieldName;
  final String? label;
  final String? subLabel;
  final List<ValidationRule>? validationRules;

  Node({
     this.id,
     this.type,
     this.fieldType,
     this.fieldName,
     this.label,
     this.subLabel,
     this.validationRules,
  });

  factory Node.fromJson(Map<String, dynamic> json) {
    return Node(
      id: json['id'],
      type: json['type'],
      fieldType: json['field_type'],
      fieldName: json['field_name'],
      label: json['label'],
      subLabel: json['subLabel'],
      validationRules: (json['validation_rules'] as List)
          .map((v) => ValidationRule.fromJson(v))
          .toList(),
    );
  }
}

class ValidationRule {
  final String type;
  final String message;

  ValidationRule({required this.type, required this.message});

  factory ValidationRule.fromJson(Map<String, dynamic> json) {
    return ValidationRule(
      type: json['type'],
      message: json['message'],
    );
  }
}

class Edge {
  final String sourceNode;
  final String targetNode;

  Edge({required this.sourceNode, required this.targetNode});

  factory Edge.fromJson(Map<String, dynamic> json) {
    return Edge(
      sourceNode: json['source_node'],
      targetNode: json['target_node'],
    );
  }
}