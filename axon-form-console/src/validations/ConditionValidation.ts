import { ConditionExpression } from '@/configs/graph';
import type { EdgeCondition } from '@/types/Graph';
import type { ConditionResponse } from '@/types/PocketBaseResponse';
import z from 'zod';

export const ConditionFormSchema = z.object({
  node_id: z.string().optional(),
  node_label: z.string().optional(),
  edge: z.string().optional(),
  expr: z.enum(ConditionExpression).optional(),
  value: z.string().optional(),
  id: z.string().optional(),
});

export type ConditionFormSchemaData = z.infer<typeof ConditionFormSchema>;

export function convertGraphEdgeConditionToConditionForm(
  condition: EdgeCondition,
): ConditionFormSchemaData {
  return {
    id: condition.id,
    node_id: condition.check_node,
    edge: condition.edge,
    expr: condition.expression as ConditionExpression,
    value: condition.expected_value,
  };
}

export function convertConditionFormToGraphEdgeCondition(
  condition: ConditionFormSchemaData,
): EdgeCondition {
  return {
    check_node: condition.node_id,
    expression: condition.expr as ConditionExpression,
    expected_value: condition.value,
    edge: condition.edge,
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
