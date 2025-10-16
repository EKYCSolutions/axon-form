import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ConditionExpression } from '@/configs/graph';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import DeleteButton from '@/components/DeleteButton';

import { convertPascalCaseToTitleCase } from '@/utils/String.ts';
import type { NodeFormSchemaData } from '@/validations/NodeValidation';
import type { MouseEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  fieldId: string;
  fieldIndex: number;
  conditionIndex: number;
  //
  onRemoveCondition: MouseEventHandler<HTMLButtonElement>;
}

export default function ConditionFormField({
  fieldId,
  fieldIndex,
  conditionIndex,

  onRemoveCondition,
}: IProps) {
  const { control, setValue, getValues } = useFormContext();

  return (
    <div
      key={fieldId}
      className='w-full space-y-2 bg-secondary/30 border border-secondary p-4 rounded-sm last:mb-2'
    >
      <div className='flex justify-between items-center'>
        <FormLabel className='font-light'>
          Condition {conditionIndex + 1}
        </FormLabel>
        <DeleteButton
          onClick={onRemoveCondition}
          showConfirmationDialog={false}
        />
      </div>
      <div className='w-full flex items-center gap-2'>
        <p className='text-primary/50 w-12'>When</p>
        <div className='grid grid-cols-5 gap-2 w-full'>
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.node_id`}
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      console.log('value >>', value);
                      setValue(
                        `fields.${fieldIndex}.conditions.${conditionIndex}.node_id`,
                        value,
                      );
                    }}
                    value={field.value || ''}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a field' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getValues('fields')
                        .filter(
                          (f: NodeFormSchemaData) =>
                            f.id != getValues(`fields.${fieldIndex}.id`),
                        )
                        .map((field: NodeFormSchemaData) => {
                          return (
                            <SelectItem key={field.id} value={field.id!}>
                              {field.label}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.expr`}
            render={({ field }) => (
              <FormItem className='col-span-1'>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      `fields.${fieldIndex}.conditions.${conditionIndex}.expr`,
                      value as ConditionExpression,
                    )
                  }
                  value={field.value || ''}
                >
                  <FormControl className='w-full'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an expression' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ConditionExpression).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {convertPascalCaseToTitleCase(key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.value`}
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormControl>
                  <Input placeholder='Enter condition value' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='w-full flex items-center gap-2'>
        <p className='text-primary/50 w-12'>Then</p>
        <div className='grid grid-cols-4 gap-2 w-full'>
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.type`}
            render={() => (
              <FormItem className='col-span-1'>
                <Input value={'Show'} disabled />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.message`}
            render={() => (
              <FormItem className='col-span-3'>
                <FormControl>
                  <Input
                    value={getValues(`fields.${fieldIndex}.label`)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
