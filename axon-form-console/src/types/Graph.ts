import type { EdgeType, NodeFieldType, NodeType } from '@/configs/graph';
import type { Node, Relationship } from '@neo4j-nvl/base';

export interface GraphNode extends Node {
  id: string;
  //
  label: string;
  //
  fieldType: NodeFieldType;
  nodeType: NodeType;
}

export interface GraphEdge extends Relationship {
  source_node: string;
  target_node: string;
  //
  edgeType: EdgeType;
}
