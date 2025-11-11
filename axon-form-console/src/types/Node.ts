import type { NodeFieldType, NodeType } from '@/configs/graph';
import type { ValidationRuleSchemaData } from '@/validations/ValidationRulesValidation';
import type { ValidationRule } from 'react-hook-form';
import { parseEdgeResponse, type Edge } from './Edge';
import type { ConditionResponse, NodeResponse } from './PocketBaseResponse';

export interface NodeOption {
  id: string;
  label: string;
  value: string;
}

export interface NodeCondition {
  id: string;
  check_node: string;
  edge: string;
  expected_value: string;
  expression: string;
  target_node_id: string;
}

export interface Node {
  id?: string;
  order?: number;
  type?: string;
  label?: string;
  value?: string;
  field_type?: string;
  field_name?: string;
  validation_rules?: ValidationRule[];
  options?: NodeOption[];
  conditions?: NodeCondition[];
  edges?: Edge[];
}

export function parseNodeResponse(node: NodeResponse): Node {
  const edges = [
    ...(node.expand?.edges_via_source_node
      ? node.expand.edges_via_source_node.map((edge) => parseEdgeResponse(edge))
      : []),
    ...(node.expand?.edges_via_target_node
      ? node.expand.edges_via_target_node.map((edge) => parseEdgeResponse(edge))
      : []),
  ];

  return {
    id: node.id,
    order: node.order,
    type: node.type,
    label: node.label,
    value: node.value,
    field_type: node.field_type,
    field_name: node.field_name ?? '',
    validation_rules: node.validation_rules as ValidationRule[],
    options: [],
    edges: edges,
  };
}

export function parseNodeCondition(
  condition: ConditionResponse,
): NodeCondition {
  return {
    id: condition.id,
    check_node: condition.check_node,
    edge: condition.edge,
    expression: condition.expression,
    expected_value: condition.expected_value,
    target_node_id: condition.target_node_id,
  };
}

export interface NodeBody {
  page: string;
  order: number | undefined;
  //
  field_name: string | undefined;
  field_type: NodeFieldType | undefined;
  label: string | undefined;
  value: string | undefined;
  type: NodeType | undefined;
  validation_rules: ValidationRuleSchemaData[];
}
