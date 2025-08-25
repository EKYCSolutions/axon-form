import '../models/model.dart';

extension FormGraphHelpers on FormGraph {
  /// Get all option labels connected to a node (for dropdown/radio).
  List<Node> getOptionsForNode(String nodeId) {
    final optionEdges = edges.where((e) => e.sourceNode == nodeId);
    return optionEdges
        .map((e) => nodes.firstWhere((n) => n.id == e.targetNode))
        .toList();
  }
}
