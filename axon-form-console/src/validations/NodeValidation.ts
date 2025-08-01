import { NodeFieldType, NodeType } from '@/configs/graph';
import type { GraphNode } from '@/types/Graph';
import type { NodeResponse } from '@/types/PocketBaseResponse';
import { generateRandomRgbColor } from '@/utils/Color';
import z from 'zod';
import { ValidationRuleFormSchema } from './ValidationRulesValidation';

export const NodeFormSchema = z
  .object({
    type: z.enum(NodeType),
    field_type: z.enum(NodeFieldType).optional(),
    label: z.string().min(1, {
      message: 'Label must be at least 1 character',
    }),
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
};

export function convertGraphNodeToNodeForm(
  node: GraphNode,
): NodeFormSchemaData {
  return {
    type: node.nodeType,
    field_type: node.fieldType,
    label: node.label,
    validation_rules: node.validations,
  };
}

export function convertNodeFormSchemaToGraphNode(node: NodeResponse) {
  return {
    id: node.id,
    nodeType: node.type,
    fieldType: node.field_type,
    label: node.label,
    caption: node.label,
    color: generateRandomRgbColor(node.type as NodeType),
    validations: node.validation_rules,
  };
}
