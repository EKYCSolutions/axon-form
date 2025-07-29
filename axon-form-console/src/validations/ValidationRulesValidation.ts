import { ValidationRuleType } from '@/configs/graph';
import z from 'zod';

export const ValidationRuleFormSchema = z.object({
  type: z.enum(ValidationRuleType, { message: 'Please select an option' }),
  value: z.union([z.string(), z.number()]).optional(),
  message: z.string().min(1, {
    message: 'Message must be at least 1 character',
  }),
});

export type ValidationRuleSchemaData = z.infer<typeof ValidationRuleFormSchema>;

export const ValidationRuleTypeWithValue = [
  ValidationRuleType.MinLength,
  ValidationRuleType.MaxLength,
  ValidationRuleType.Pattern,
  ValidationRuleType.Min,
  ValidationRuleType.Max,
];
