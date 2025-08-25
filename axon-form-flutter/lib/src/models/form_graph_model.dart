

import 'model.dart';

class FormGraph {
  final List<Node> nodes;
  final List<Edge> edges;

  FormGraph({required this.nodes, required this.edges});

  factory FormGraph.fromJson(Map<String, dynamic> json) {
    return FormGraph(
      nodes: (json['nodes'] as List).map((n) => Node.fromJson(n)).toList(),
      edges: (json['edges'] as List).map((e) => Edge.fromJson(e)).toList(),
    );
  }
}

