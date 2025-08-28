
class Node {
  final String? id;
  final String? type;
  final String? fieldType;
  final String? fieldName;
  final String? subLabel;
  final String? label;
  final List<ValidationRule>? validationRules;

  Node({
    this.id,
    this.type,
    this.fieldType,
    this.label,
    this.validationRules,
    this.fieldName,
    this.subLabel,
  });

  factory Node.fromJson(Map<String, dynamic> json) {
    return Node(
      id: json['id'],
      type: json['type'],
      fieldType: json['field_type'],
      label: json['label'],
      fieldName: json['field_name'],
      subLabel: json['sub_label'],
      validationRules: (json['validation_rules'] as List)
          .map((v) => ValidationRule.fromJson(v))
          .toList(),
    );
  }
}

class ValidationRule {
  final String? type;
  final String? message;
  final String? value;

  ValidationRule({
    this.type,
    this.message,
    this.value,
  });

  factory ValidationRule.fromJson(Map<String, dynamic> json) {
    return ValidationRule(
      type: json['type'],
      message: json['message'],
      value: json['value'],
    );
  }
}

class Edge {
  final String id;
  final String label;
  final String sourceNode;
  final String targetNode;
  final String type;
  final List<EdgeCondition> conditions;

  Edge({
    required this.id,
    required this.label,
    required this.sourceNode,
    required this.targetNode,
    required this.type,
    required this.conditions,
  });

  factory Edge.fromJson(Map<String, dynamic> json) {
    return Edge(
      id: json['id'],
      label: json['label'],
      sourceNode: json['source_node'],
      targetNode: json['target_node'],
      type: json['type'],
      conditions: (json['conditions'] ?? [])
          .map<EdgeCondition>((c) => EdgeCondition.fromJson(c))
          .toList(),
    );
  }
}

class EdgeCondition {
  final String id;
  final String node;
  final String edge;
  final String expr;
  final String value;

  EdgeCondition({
    required this.id,
    required this.node,
    required this.edge,
    required this.expr,
    required this.value,
  });

  factory EdgeCondition.fromJson(Map<String, dynamic> json) {
    return EdgeCondition(
      id: json['id'],
      node: json['node'],
      edge: json['edge'],
      expr: json['expr'],
      value: json['value'],
    );
  }
}

class ConditionGroup {
  final String id;
  final String node;
  final String conditions; // boolean expression string like "A AND (B OR C)"

  ConditionGroup({
    required this.id,
    required this.node,
    required this.conditions,
  });

  factory ConditionGroup.fromJson(Map<String, dynamic> json) {
    return ConditionGroup(
      id: json['id'],
      node: json['node'],
      conditions: json['conditions'],
    );
  }
}
