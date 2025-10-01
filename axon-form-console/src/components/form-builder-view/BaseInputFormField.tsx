import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ValidationRuleType } from '@/configs/graph';
import { Plus } from 'lucide-react';

import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import { useFieldArray, useFormContext } from 'react-hook-form';

import OptionFormField from './OptionFormField';
import ValidationRuleFormField from './ValidationRuleFormField';

interface IProps {
  fieldIndex: number;
  //
  hasOptions?: boolean;
}

export default function BaseInputFormField({ fieldIndex, hasOptions }: IProps) {
  const { control, watch } = useFormContext();

  const {
    fields: validationRuleFields,
    append: appendValidationRuleField,
    remove: removeValidationRuleField,
  } = useFieldArray<PageFormSchemaData>({
    name: `fields.${fieldIndex}.validation_rules`,
  });

  const {
    fields: selectOptionFields,
    append: appendSelectOptionField,
    remove: removeSelectOptionField,
  } = useFieldArray<PageFormSchemaData>({
    name: `fields.${fieldIndex}.select_options`,
  });

  return (
    <div className='space-y-2 grid grid-cols-2 gap-4'>
      <FormField
        control={control}
        name={`fields.${fieldIndex}.field_name`}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Field name</FormLabel>
              <FormControl>
                <Input
                  className='font-light text-sm'
                  placeholder='Enter the field name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name={`fields.${fieldIndex}.label`}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input
                  className='font-light text-sm'
                  placeholder='Enter the field label'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name={`fields.${fieldIndex}.placeholder`}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  className='font-light text-sm'
                  placeholder='Enter the placeholder'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {hasOptions && (
        <div className='col-span-full'>
          <FormLabel className='mb-3'>Options</FormLabel>
          <div className='flex flex-col'>
            {selectOptionFields.map((field, index) => {
              const selectOptionLabel = watch(
                `fields.${fieldIndex}.select_options.${index}.label`,
              );

              return (
                <OptionFormField
                  fieldId={field.id}
                  fieldIndex={fieldIndex}
                  optionIndex={index}
                  label={selectOptionLabel}
                  //
                  onRemoveOption={() => removeSelectOptionField(index)}
                />
              );
            })}
          </div>

          <Button
            type='button'
            className='w-full'
            variant='outline'
            onClick={() =>
              appendSelectOptionField({
                label: '',
                value: '',
              })
            }
          >
            <Plus />
            Add Option
          </Button>
        </div>
      )}
      <div className='col-span-full'>
        <FormLabel className='mb-3'>Validation Rules</FormLabel>
        <div className='flex flex-col gap-2'>
          {validationRuleFields.map((field, index) => {
            return (
              <ValidationRuleFormField
                fieldId={field.id}
                fieldIndex={fieldIndex}
                validationRuleIndex={index}
                onRemoveValidationRule={() => removeValidationRuleField(index)}
              />
            );
          })}
        </div>

        <Button
          type='button'
          className='w-full'
          variant='outline'
          onClick={() =>
            appendValidationRuleField({
              type: '' as ValidationRuleType,
              message: '',
            })
          }
        >
          <Plus />
          Add Validation
        </Button>
      </div>
    </div>
  );
}
