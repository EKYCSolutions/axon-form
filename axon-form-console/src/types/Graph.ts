import type {
  ConditionExpression,
  EdgeType,
  NodeFieldType,
  NodeType,
} from '@/configs/graph';
import type { Node, Relationship } from '@neo4j-nvl/base';
import type { ValidationRule } from 'react-hook-form';

export interface GraphNode extends Node {
  id: string;
  //
  label: string;
  //
  nodeType: NodeType;
  fieldType?: NodeFieldType;
  fieldName?: string;
  //
  is_required?: boolean;
  //
  configs?: Record<string, unknown>;
  validations?: ValidationRule[];
  //
  edges: GraphEdge[];
}

export interface GraphEdge extends Relationship {
  label: string;
  sourceNode: string;
  targetNode: string;
  //
  edgeType: EdgeType;
  //
  configs?: Record<string, unknown>;
  //
  conditions?: EdgeCondition[];
}

export interface EdgeCondition {
  id: string;
  //
  edge: string;
  check_node: string;
  //
  expression: ConditionExpression;
  expected_value: string;
}
export interface EdgeConditionGroup {
  id: string;
  //
  node: string;
  conditions: string;
}
