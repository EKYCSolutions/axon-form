

import 'model.dart';

class FormGraph {
  final List<Node> nodes;
  final List<Edge> edges;
  final List<ConditionGroup> conditionGroups;

  FormGraph({
    required this.nodes,
    required this.edges,
    required this.conditionGroups,
  });

  factory FormGraph.fromJson(Map<String, dynamic> json) {
    return FormGraph(
      nodes: (json['nodes'] as List).map((n) => Node.fromJson(n)).toList(),
      edges: (json['edges'] as List).map((e) => Edge.fromJson(e)).toList(),
      conditionGroups: (json['condition_groups'] as List)
          .map((cg) => ConditionGroup.fromJson(cg))
          .toList(),
    );
  }
}

