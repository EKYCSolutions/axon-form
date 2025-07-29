import { ConditionExpression } from '@/configs/graph';
import z from 'zod';

export const ConditionFormSchema = z.object({
  node: z.string().optional(),
  edge: z.string().optional(),
  expr: z.enum(ConditionExpression).optional(),
  value: z.union([z.string(), z.number()]).optional(),
});

export type ConditionFormSchemaData = z.infer<typeof ConditionFormSchema>;

export const ConditionFormSchemaDefaultValue: ConditionFormSchemaData = {
  node: undefined,
  edge: undefined,
  expr: undefined,
  value: undefined,
};

// export function convertGraphNodeToNodeForm(
//   node: GraphNode,
// ): ConditionFormSchemaData {
//   return {
//     type: node.nodeType,
//     field_type: node.fieldType,
//     label: node.label,
//   };
// }

// export function ConditionFormSchemaToGraphNode(node) {
//   return {
//     id: node.id,
//     nodeType: node.type,
//     fieldType: node.field_type,
//     label: node.label,
//     caption: node.label,
//   };
// }
