import 'model.dart';

class FormGraph {
  final Layout layout;
  final List<Node> nodes;
  final List<Edge> edges;
  final List<ConditionGroup> conditionGroups;

  FormGraph({
    required this.layout,
    required this.nodes,
    required this.edges,
    required this.conditionGroups,
  });

  factory FormGraph.fromJson(Map<String, dynamic> json) {
    return FormGraph(
      layout: Layout.fromJson(json['layout']),
      nodes: (json['nodes'] as List).map((n) => Node.fromJson(n)).toList(),
      edges: (json['edges'] as List).map((e) => Edge.fromJson(e)).toList(),
      conditionGroups: (json['condition_groups'] as List)
          .map((cg) => ConditionGroup.fromJson(cg))
          .toList(),
    );
  }

  Node? getNodeById(String id) {
    try {
      return nodes.firstWhere((node) => node.id == id);
    } catch (e) {
      return null;
    }
  }
  
}

class Layout {
  final List<Page> pages;

  Layout({required this.pages});

  factory Layout.fromJson(Map<String, dynamic> json) {
    return Layout(
      pages: (json['pages'] as List).map((p) => Page.fromJson(p)).toList(),
    );
  }
}

class Page {
  final String id;
  final String title;
  final String desc;
  final List<String> fields;

  Page({
    required this.id,
    required this.title,
    required this.desc,
    required this.fields,
  });

  factory Page.fromJson(Map<String, dynamic> json) {
    return Page(
      id: json['id'],
      title: json['title'],
      desc: json['desc'] ?? json['description'] ??"N/A",
      fields: json['fields'] != null?  (json['fields'] as List).map((f) => f.toString()).toList() : (json['field_ids'] as List).map((f) => f.toString()).toList(),
    );
  }
}


