import { ConditionExpression } from '@/configs/graph';
import type { EdgeCondition } from '@/types/Graph';
import type { ConditionResponse } from '@/types/PocketBaseResponse';
import z from 'zod';

export const ConditionFormSchema = z.object({
  node: z.string().optional(),
  edge: z.string().optional(),
  expr: z.enum(ConditionExpression).optional(),
  value: z.union([z.string(), z.number()]).optional(),
  id: z.string().optional(),
});

export type ConditionFormSchemaData = z.infer<typeof ConditionFormSchema>;

export const ConditionFormSchemaDefaultValue: ConditionFormSchemaData = {
  node: undefined,
  edge: undefined,
  expr: undefined,
  value: undefined,
};

export function convertGraphEdgeConditionToConditionForm(
  condition: EdgeCondition,
): ConditionFormSchemaData {
  return {
    id: condition.id,
    node: condition.check_node,
    edge: condition.edge,
    expr: condition.expression as ConditionExpression,
    value: condition.expected_value,
  };
}

export function convertConditionFormToGraphEdgeCondition(
  condition: ConditionFormSchemaData,
): EdgeCondition {
  return {
    check_node: condition.node,
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
