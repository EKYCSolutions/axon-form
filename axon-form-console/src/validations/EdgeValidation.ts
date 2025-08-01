import { ConditionExpression, EdgeType } from '@/configs/graph';
import type { EdgeCondition, GraphEdge } from '@/types/Graph';
import type {
  ConditionResponse,
  EdgeResponse,
} from '@/types/PocketBaseResponse';
import z from 'zod';
import { ConditionFormSchema } from './ConditionValidation.js';

export const EdgeFormSchema = z
  .object({
    source_node: z.string().min(1, {
      message: 'Source node must be selected',
    }),
    target_node: z.string().min(1, {
      message: 'Target node must be selected',
    }),
    type: z.enum(EdgeType),
    conditions: z.array(ConditionFormSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.type == EdgeType.Shows) {
        return data.conditions?.length !== 0;
      }
      return true;
    },
    {
      message: 'Please add condition',
      path: ['condition'],
    },
  );

export type EdgeFormSchemaData = z.infer<typeof EdgeFormSchema>;

export const EdgeFormSchemaDefaultValue: EdgeFormSchemaData = {
  source_node: '',
  target_node: '',
  type: '' as EdgeType,
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

export function convertEdgeResponseToGraphEdge(edge: EdgeResponse): GraphEdge {
  return {
    id: edge.id,
    from: edge.source_node,
    to: edge.target_node,
    sourceNode: edge.source_node,
    targetNode: edge.target_node,
    edgeType: edge.type as EdgeType,
    caption: edge.type?.toString(),
    conditions: edge.expand?.conditions_via_edge?.map((condition) =>
      convertConditionResponseToGraphEdgeCondition(condition),
    ),
  };
}

export function convertConditionResponseToGraphEdgeCondition(
  condition: ConditionResponse,
): EdgeCondition {
  return {
    id: condition.id,
    check_node: condition.check_node,
    expression: condition.expression as ConditionExpression,
    expected_value: condition.expected_value,
    edge: condition.edge,
  };
}
