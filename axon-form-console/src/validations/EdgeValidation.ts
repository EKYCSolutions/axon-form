import { EdgeType } from '@/configs/graph';
import type { GraphEdge } from '@/types/Graph';
import z from 'zod';

export const EdgeFormSchema = z.object({
  source_node: z.string().min(1, {
    message: 'Source node must be selected',
  }),
  target_node: z.string().min(1, {
    message: 'Target node must be selected',
  }),
  type: z.enum(EdgeType),
});

export type EdgeFormSchemaData = z.infer<typeof EdgeFormSchema>;

export const EdgeFormSchemaDefaultValue: EdgeFormSchemaData = {
  source_node: '',
  target_node: '',
  type: EdgeType.Validates,
};

export function convertGraphEdgeToEdgeForm(
  node: GraphEdge,
): EdgeFormSchemaData {
  return {
    source_node: node.sourceNode,
    target_node: node.targetNode,
    type: node.edgeType,
  };
}

export function convertEdgeFormSchemaToGraphEdge(edge: EdgeFormSchemaData) {
  return {
    id: edge.id,
    from: edge.source_node,
    to: edge.target_node,
    sourceNode: edge.source_node,
    targetNode: edge.target_node,
    edgeType: edge.type,
    caption: edge.type?.toString(),
  };
}
