import { NodeFieldType, NodeType } from '@/configs/graph';
import type { GraphEdge, GraphNode } from '@/types/Graph';
import z from 'zod';
import type { EdgeFormSchemaData } from './EdgeValidation';

export const NodeFormSchema = z.object({
  type: z.enum(NodeType),
  field_type: z.enum(NodeFieldType),
  label: z.string().min(1, {
    message: 'Label must be at least 1 character',
  }),
});

export type NodeFormSchemaData = z.infer<typeof NodeFormSchema>;

export const NodeFormSchemaDefaultValue: NodeFormSchemaData = {
  type: NodeType.Input,
  field_type: NodeFieldType.Text,
  label: '',
};

export function convertGraphNodeToNodeForm(
  node: GraphNode,
): NodeFormSchemaData {
  return {
    type: node.nodeType,
    field_type: node.fieldType,
    label: node.label,
  };
}

export function convertNodeFormSchemaToGraphNode(node: NodeFormSchemaData) {
  return {
    nodeType: node.type,
    fieldType: node.field_type,
    label: node.label,
    caption: node.label,
  };
}

export function convertGraphEdgeToEdgeForm(
  node: GraphEdge,
): EdgeFormSchemaData {
  return {
    source_node: node.sourceNode,
    target_node: node.targetNode,
    edge_type: node.edgeType,
  };
}
