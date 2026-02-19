import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NodeFieldType, ValidationRuleType } from '@/configs/graph';
import { Plus } from 'lucide-react';

import { Label } from '@/components/ui/label';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import { useFieldArray, useFormContext } from 'react-hook-form';
// import HelpTooltip from '../HelpToolTip';
import ConditionFormField from './ConditionFormField';
import OptionFormField from './OptionFormField';
import ValidationRuleFormField from './ValidationRuleFormField';
import HelpTooltip from '../HelpTooltip';

interface IProps {
  fieldIndex: number;
  //
  hasOptions?: boolean;
}

export default function BaseInputFormField({ fieldIndex, hasOptions }: IProps) {
  const { control, watch, getValues } = useFormContext();
  const fieldType = watch(`fields.${fieldIndex}.field_type`);
  const isAddressDropdown = fieldType === NodeFieldType.AddressDropdown;
  const addressLevel = watch(`fields.${fieldIndex}.config.level`);
  const allFields = watch('fields') as PageFormSchemaData['fields'];
  const levelParentMap: Record<string, string | null> = {
    province: null,
    district: 'province',
    commune: 'district',
    village: 'commune',
  };
  const requiredParentLevel =
    addressLevel && typeof addressLevel === 'string'
      ? (levelParentMap[addressLevel] ?? null)
      : null;
  const parentFieldOptions = (allFields ?? [])
    .filter(
      (field, index) =>
        index !== fieldIndex &&
        field.field_name &&
        field.field_type == NodeFieldType.AddressDropdown &&
        requiredParentLevel &&
        field.config?.level === requiredParentLevel,
    )
    .map((field) => ({
      id: field.id as string,
      name: field.label as string,
    }));
  const parentDisabled =
    requiredParentLevel === null || parentFieldOptions.length === 0;

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

  const {
    fields: conditionFields,
    append: appendConditionField,
    remove: removeConditionField,
  } = useFieldArray<PageFormSchemaData>({
    name: `fields.${fieldIndex}.conditions`,
  });

  return (
    <div className='space-y-2 grid grid-cols-2 gap-4'>
      <FormField
        control={control}
        name={`fields.${fieldIndex}.field_name`}
        render={({ field }) => {
          return (
            <FormItem className='h-16'>
              <div className='flex items-center gap-2'>
                <FormLabel>Field Name</FormLabel>
                <HelpTooltip text='Unique key used in data and logic (e.g. first_name).' />
              </div>
              <FormControl>
                <Input placeholder='Enter the field name' {...field} />
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
            <FormItem className='h-16'>
              <div className='flex items-center gap-2'>
                <FormLabel>Field Label</FormLabel>
                <HelpTooltip text='User-facing label shown on the form.' />
              </div>
              <FormControl>
                <Input
                  className='text-base'
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
              <div className='flex items-center gap-2'>
                <FormLabel>Placeholder</FormLabel>
                <HelpTooltip text='Hint text shown inside the input.' />
              </div>
              <FormControl>
                <Input placeholder='Enter the placeholder' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {isAddressDropdown && (
        <FormField
          control={control}
          name={`fields.${fieldIndex}.config.level`}
          render={({ field }) => {
            return (
              <FormItem>
                <div className='flex items-center gap-2'>
                  <FormLabel>Address Level</FormLabel>
                  <HelpTooltip text='Select the hierarchy level for this address field.' />
                </div>
                <FormControl>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select level' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='province'>Province</SelectItem>
                      <SelectItem value='district'>District</SelectItem>
                      <SelectItem value='commune'>Commune</SelectItem>
                      <SelectItem value='village'>Village</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}
      {isAddressDropdown && (
        <FormField
          control={control}
          name={`fields.${fieldIndex}.config.allow_custom_value`}
          render={({ field }) => {
            return (
              <FormItem className='flex items-center gap-2 h-9'>
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                </FormControl>
                <div className='flex items-center gap-2'>
                  <FormLabel className='mb-0'>Allow Custom Value</FormLabel>
                  <HelpTooltip text='Allow users to enter a value not in the list.' />
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}
      {isAddressDropdown && (
        <FormField
          control={control}
          name={`fields.${fieldIndex}.config.parent_field_id`}
          render={({ field }) => {
            return (
              <FormItem>
                <div className='flex items-center gap-2'>
                  <FormLabel>Parent Address Field</FormLabel>
                  <HelpTooltip text='Link this field to its parent address level.' />
                </div>
                <FormControl>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                    disabled={parentDisabled}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue
                        placeholder={
                          parentDisabled
                            ? 'No parent available'
                            : 'Select parent field'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {parentFieldOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      )}
      {hasOptions && (
        <div className='col-span-full'>
          <div className='flex items-center gap-2 mb-3'>
            <FormLabel>Options</FormLabel>
            <HelpTooltip text='List of selectable options for this field.' />
          </div>
          <div className='flex flex-col'>
            {selectOptionFields.map((field, index) => {
              const selectOptionLabel = watch(
                `fields.${fieldIndex}.select_options.${index}.label`,
              );

              return (
                <OptionFormField
                  key={field.id}
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
        <div className='flex items-center gap-2 mb-3'>
          <FormLabel>Validation Rules</FormLabel>
          <HelpTooltip text='Rules that validate the input value.' />
        </div>
        <div className='flex flex-col gap-2'>
          {validationRuleFields.map((field, index) => {
            return (
              <ValidationRuleFormField
                key={field.id}
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
      <div className='col-span-full'>
        <div className='flex items-center gap-2 mb-3'>
          <FormLabel>Condition</FormLabel>
          <HelpTooltip text='Show this field based on other field values.' />
        </div>
        <div className='flex flex-col gap-2'>
          {conditionFields.map((field, index) => {
            return (
              <ConditionFormField
                key={field.id}
                fieldId={field.id}
                fieldIndex={fieldIndex}
                conditionIndex={index}
                onRemoveCondition={() => removeConditionField(index)}
              />
            );
          })}
        </div>

        <Button
          disabled={getValues('fields').length <= 1}
          type='button'
          className='w-full'
          variant='outline'
          onClick={() =>
            appendConditionField({
              type: '' as ValidationRuleType,
              message: '',
            })
          }
        >
          <Plus />
          Add Condition
        </Button>

        {getValues('fields').length <= 0 && (
          <Label className='text-primary/50 font-normal mt-2 italic'>
            Please create more fields to add condition
          </Label>
        )}
      </div>
    </div>
  );
}
