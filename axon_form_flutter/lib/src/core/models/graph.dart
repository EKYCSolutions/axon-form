import 'package:axon_form_flutter/src/core/models/node.dart';

import 'page.dart';

class AxonFormGraph {
  final Map<String, AxonFormPage> pages;
  final Map<String, Map<String, AxonFormNode>> nodes;
  //
  Map<String, AxonFormPage> pagesToShow;

  AxonFormGraph({
    required this.pages,
    required this.nodes,
    required this.pagesToShow,
  });

  factory AxonFormGraph.fromJson(Map<String, dynamic> json) {
    return AxonFormGraph(
      pages: (json['pages'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(key, AxonFormPage.fromJson(value)),
      ),
      nodes: (json['nodes'] as Map<String, dynamic>).map((key, value) {
        return MapEntry(
          key,
          (value as Map<String, dynamic>).map(
            (k, v) => MapEntry(k, AxonFormNode.fromJson(v)),
          ),
        );
      }),
      pagesToShow: {},
    );
  }
}
