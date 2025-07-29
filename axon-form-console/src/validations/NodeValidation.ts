import { NodeFieldType, NodeType } from '@/configs/graph';
import type { GraphNode } from '@/types/Graph';
import z from 'zod';
import { ValidationRuleFormSchema } from './ValidationRulesValidation';

export const NodeFormSchema = z
  .object({
    type: z.enum(NodeType),
    field_type: z.enum(NodeFieldType).optional(),
    label: z.string().min(1, {
      message: 'Label must be at least 1 character',
    }),
    is_visible: z.boolean().optional(),
    validation_rules: z.array(ValidationRuleFormSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type == NodeType.Input) {
        return data.field_type !== undefined;
      }
      return true;
    },
    {
      message: 'Please select a field type',
      path: ['field_type'],
    },
  );

export type NodeFormSchemaData = z.infer<typeof NodeFormSchema>;

export const NodeFormSchemaDefaultValue: NodeFormSchemaData = {
  type: '' as NodeType,
  field_type: undefined,
  label: '',
  is_visible: true,
};

export function convertGraphNodeToNodeForm(
  node: GraphNode,
): NodeFormSchemaData {
  return {
    type: node.nodeType,
    field_type: node.fieldType,
    label: node.label,
    is_visible: node.is_visible,
    validation_rules: node.validations,
  };
}
3;

export function convertNodeFormSchemaToGraphNode(node) {
  return {
    id: node.id,
    nodeType: node.type,
    fieldType: node.field_type,
    label: node.label,
    caption: node.label,
    is_visible: node.is_visible,
    validations: node.validation_rules,
  };
}
