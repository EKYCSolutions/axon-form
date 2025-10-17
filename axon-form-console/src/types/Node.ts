import type { NodeFieldType, NodeType } from '@/configs/graph';
import type { ValidationRuleSchemaData } from '@/validations/ValidationRulesValidation';
import type { ValidationRule } from 'react-hook-form';
import type { NodeResponse } from './PocketBaseResponse';

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
  type?: string;
  label?: string;
  value?: string;
  field_type?: string;
  field_name?: string;
  validation_rules?: ValidationRule[];
  options?: NodeOption[];
  conditions?: NodeCondition[];
}

export function parseNodeResponse(node: NodeResponse): Node {
  return {
    id: node.id,
    type: node.type,
    label: node.label,
    value: node.value,
    field_type: node.field_type,
    field_name: node.field_name ?? '',
    validation_rules: node.validation_rules as ValidationRule[],
    options: [],
  };
}

export interface NodeBody {
  page: string;
  //
  field_name: string | undefined;
  field_type: NodeFieldType | undefined;
  label: string | undefined;
  value: string | undefined;
  type: NodeType | undefined;
  validation_rules: ValidationRuleSchemaData[];
}
