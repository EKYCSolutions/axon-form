import type { ValidationRule } from 'react-hook-form';
import type { NodeResponse } from './PocketBaseResponse';

export interface NodeOption {
  label: string;
  value: string;
}

export interface Node {
  id: string;
  type: string;
  label: string;
  value: string;
  field_type: string;
  field_name: string;
  validation_rules: ValidationRule[];
  options?: NodeOption[];
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
