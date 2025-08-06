import type {
  ConditionExpression,
  EdgeType,
  NodeFieldType,
  NodeType,
  ValidationRuleType,
} from '@/configs/graph';
import type { Node, Relationship } from '@neo4j-nvl/base';

export interface GraphNode extends Node {
  id: string;
  //
  label: string;
  //
  nodeType: NodeType;
  fieldType?: NodeFieldType;
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
  expected_value: string | number | boolean;
}
export interface EdgeConditionGroup {
  id: string;
  //
  conditions: string;
}

export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number;
  message: string;
}
