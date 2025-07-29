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
  is_visible?: boolean;
  is_required?: boolean;
  //
  configs?: Record<string, any>;
  validations?: ValidationRule[];
}

export interface GraphEdge extends Relationship {
  sourceNode: string;
  targetNode: string;
  //
  edgeType: EdgeType;
  //
  configs?: Record<string, any>;
  //
  conditions: EdgeCondition[];
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

export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number;
  message: string;
}
