import { z } from 'zod';
import { ConditionFormSchema } from './ConditionValidation';

//
export const PageConditionFormSchema = z.object({
  conditions: z.array(ConditionFormSchema),
});

export type PageConditionFormSchemaData = z.infer<
  typeof PageConditionFormSchema
>;
