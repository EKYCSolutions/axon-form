import { NodeFieldType, NodeType } from '@/configs/graph';
import type { GraphNode } from '@/types/Graph';
import z from 'zod';

export const AddNodeFormSchema = z.object({
  type: z.enum(NodeType),
  field_type: z.enum(NodeFieldType),
  label: z.string().min(1, {
    message: 'Label must be at least 1 character',
  }),
});

export type AddNodeFormSchemaData = z.infer<typeof AddNodeFormSchema>;

export const AddNodeFormSchemaDefaultValue: AddNodeFormSchemaData = {
  type: NodeType.Input,
  field_type: NodeFieldType.Text,
  label: '',
};

export function convertGraphNodeToNodeForm(node: GraphNode) {
  return {
    type: node.nodeType,
    field_type: node.fieldType,
    label: node.label,
  };
}

export function convertNodeFormSchemaToGraphNode(node: AddNodeFormSchemaData) {
  return {
    nodeType: node.type,
    fieldType: node.field_type,
    label: node.label,
  };
}
