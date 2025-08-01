import { ConditionGroupExpression } from '@/configs/graph';
import z from 'zod';

const ConditionGroupFirstLevelFormSchema = z.object({
  expr: z.enum(ConditionGroupExpression),
  edges: z
    .array(
      z.object({
        id: z.string().min(1),
      }),
    )
    .min(2, {
      message: 'Please select at least two edges',
    }),
  children: z.array(z.any()).optional(),
});

export const ConditionGroupFormSchema = z.object({
  expr: z.enum(ConditionGroupExpression),
  edges: z
    .array(
      z.object({
        id: z.string().min(1),
      }),
    )
    .min(2, {
      message: 'Please select at least two edges',
    }),
  children: z.array(ConditionGroupFirstLevelFormSchema).optional(),
});

export type ConditionGroupFormSchemaData = z.infer<
  typeof ConditionGroupFormSchema
>;
