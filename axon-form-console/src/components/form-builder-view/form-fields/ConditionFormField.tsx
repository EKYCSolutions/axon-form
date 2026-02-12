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

import { Badge } from '@/components/ui/badge';
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
        <FormLabel>Condition {conditionIndex + 1}</FormLabel>
        <DeleteButton
          onClick={onRemoveCondition}
          showConfirmationDialog={false}
        />
      </div>
      <div className='w-full flex items-center gap-2'>
        <p className='text-primary/50 w-24'>When Field</p>
        <div className='grid grid-cols-5 gap-2 w-full'>
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`}
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      setValue(
                        `fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`,
                        value,
                      );
                    }}
                    value={field.value || ''}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a field'>
                          {(() => {
                            const selectedId = getValues(
                              `fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`,
                            );
                            const selectedField = getValues('fields').find(
                              (f: NodeFormSchemaData) => f.id === selectedId,
                            );
                            if (!selectedField) return null;
                            return (
                              <div className='flex flex-row items-center gap-2'>
                                <span>{selectedField.label}</span>
                                <Badge
                                  variant='outline'
                                  className='text-gray-400'
                                >
                                  {selectedField.field_name}
                                </Badge>
                              </div>
                            );
                          })()}
                        </SelectValue>
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
                              <div className='flex flex-col items-start'>
                                <p>{field.label}</p>
                                <span className='text-gray-400 text-xs'>
                                  {field.field_name}
                                </span>
                              </div>
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
                  {(() => {
                    const selectedCheckNodeId = getValues(
                      `fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`,
                    );
                    const selectedField = getValues('fields').find(
                      (f: NodeFormSchemaData) => f.id === selectedCheckNodeId,
                    );
                    const options = selectedField?.select_options ?? [];

                    if (options.length > 0) {
                      return (
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <FormControl className='w-full'>
                            <SelectTrigger>
                              <SelectValue placeholder='Select an option' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem
                                key={option.id ?? option.value}
                                value={option.id ?? option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }

                    return (
                      <Input placeholder='Enter condition value' {...field} />
                    );
                  })()}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='w-full flex items-center gap-2'>
        <p className='text-primary/50 w-24'>Then</p>
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
