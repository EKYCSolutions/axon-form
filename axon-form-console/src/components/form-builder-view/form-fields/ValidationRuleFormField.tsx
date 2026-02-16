import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ValidationRuleType } from '@/configs/graph';
import { ValidationRuleTypeWithValue } from '@/validations/ValidationRulesValidation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import DeleteButton from '@/components/DeleteButton';

import { convertPascalCaseToTitleCase } from '@/utils/String.ts';
import type { MouseEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';
import HelpTooltip from '../HelpTooltip';

interface IProps {
  fieldId: string;
  fieldIndex: number;
  validationRuleIndex: number;
  //
  onRemoveValidationRule: MouseEventHandler<HTMLButtonElement>;
}

export default function ValidationRuleFormField({
  fieldId,
  fieldIndex,
  validationRuleIndex,

  onRemoveValidationRule,
}: IProps) {
  const { control, watch, setValue } = useFormContext();

  return (
    <div
      key={fieldId}
      className='space-y-2 bg-secondary/30 border border-secondary p-4 rounded-sm last:mb-2'
    >
      <div className='flex justify-between items-center'>
        <FormLabel>Validation {validationRuleIndex + 1}</FormLabel>
        <DeleteButton
          onClick={onRemoveValidationRule}
          showConfirmationDialog={false}
        />
      </div>
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation_rules.${validationRuleIndex}.type`}
        render={({ field }) => {
          const selectedType = field.value as ValidationRuleType;
          // Map of hints for each validation rule type
          const validationTypeHints: Record<ValidationRuleType, string> = {
            required: 'This field must not be empty.',
            min_length: 'Minimum number of characters required.',
            max_length: 'Maximum number of characters allowed.',
            pattern:
              'Value must match the specified pattern. Please use RE2 pattern.',
            email: 'Value must be a valid email address.',
            min: 'Value must be larger than the specified min value.',
            max: 'Value must be smaller than the specified max value',
            // Add more as needed
          };

          return (
            <FormItem>
              <Select
                onValueChange={(value) =>
                  setValue(
                    `fields.${fieldIndex}.validation_rules.${validationRuleIndex}.type`,
                    value as ValidationRuleType,
                  )
                }
                value={field.value || ''}
              >
                <FormControl className='w-full'>
                  <div className='w-full flex gap-2 items-center'>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a validation type' />
                    </SelectTrigger>
                    {selectedType && validationTypeHints[selectedType] && (
                      <HelpTooltip text={validationTypeHints[selectedType]} />
                    )}
                  </div>
                </FormControl>
                <SelectContent>
                  {Object.entries(ValidationRuleType).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {convertPascalCaseToTitleCase(key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {ValidationRuleTypeWithValue.includes(
        watch(
          `fields.${fieldIndex}.validation_rules.${validationRuleIndex}.type`,
        ),
      ) && (
        <FormField
          control={control}
          name={`fields.${fieldIndex}.validation_rules.${validationRuleIndex}.value`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Enter value' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name={`fields.${fieldIndex}.validation_rules.${validationRuleIndex}.message`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder='Enter validation message' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
