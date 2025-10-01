import { EdgeType } from '@/configs/graph';
import type { GraphEdge } from '@/types/Graph';
import type { EdgeResponse } from '@/types/PocketBaseResponse';
import z from 'zod';
import {
  ConditionFormSchema,
  convertConditionResponseToGraphEdgeCondition,
  convertGraphEdgeConditionToConditionForm,
} from './ConditionValidation';

export const EdgeFormSchema = z
  .object({
    label: z.string().min(1, {
      message: 'Edge label is required',
    }),
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
  label: '',
  source_node: '',
  target_node: '',
  type: '' as EdgeType,
};

export function convertGraphEdgeToEdgeForm(edge: GraphEdge) {
  return {
    id: edge.id,
    label: edge.label,
    source_node: edge.sourceNode,
    target_node: edge.targetNode,
    type: edge.edgeType,
    conditions: edge.conditions?.map((condition) =>
      convertGraphEdgeConditionToConditionForm(condition),
    ),
  };
}

export function convertEdgeResponseToGraphEdge(edge: EdgeResponse): GraphEdge {
  return {
    id: edge.id,
    label: edge.label,
    from: edge.source_node,
    to: edge.target_node,
    sourceNode: edge.source_node,
    targetNode: edge.target_node,
    edgeType: edge.type as EdgeType,
    caption: edge.label,
    conditions: edge.expand?.conditions_via_edge?.map((condition) =>
      convertConditionResponseToGraphEdgeCondition(condition),
    ),
  };
}
