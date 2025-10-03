import type { ValidationRuleType } from '@/configs/graph';

export interface ValidationRule {
  type: ValidationRuleType;
  message: string;
  value?: string;
}
