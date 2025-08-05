import { cn } from '@/lib/utils';
import type { NodeFormSchemaData } from '@/validations/NodeValidation';
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NodeFieldType, NodeType, ValidationRuleType } from '@/configs/graph';
import { convertPascalCaseToTitleCase } from '@/utils/string';
import { ValidationRuleTypeWithValue } from '@/validations/ValidationRulesValidation';
import { Plus } from 'lucide-react';
import DeleteButton from '../DeleteButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';

interface IProps {
  className?: string;
  //
  form: UseFormReturn<NodeFormSchemaData>;
  fieldArray: UseFieldArrayReturn<NodeFormSchemaData>;
  //
  onSubmit: (data: NodeFormSchemaData) => void;
}

export default function NodeForm({
  className,
  form,
  fieldArray,
  onSubmit,
}: IProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        <FormField
          control={form.control}
          name='label'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Node Label</FormLabel>
                <FormControl>
                  <Input placeholder='Enter the label' {...field} />
                </FormControl>
                <FormDescription>
                  This is the label for your node
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Type</FormLabel>
              <Select
                onValueChange={(value) =>
                  form.setValue('type', value as NodeType, {
                    shouldValidate: true,
                  })
                }
                value={field.value || ''}
              >
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a node type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(NodeType).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch('type') === NodeType.Input && (
          <>
            <Separator className='bg-gray-400/25' />
            <FormField
              control={form.control}
              name='field_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger>
                        <SelectValue placeholder='Select field type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='w-full'>
                      {Object.entries(NodeFieldType).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel>Field Validations</FormLabel>
            {fieldArray.fields.map((field, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <FormLabel className='font-light'>
                    Validation {index + 1}
                  </FormLabel>
                  <DeleteButton onClick={() => fieldArray.remove(index)} />
                </div>
                <FormField
                  control={form.control}
                  name={`validation_rules.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) =>
                          form.setValue(
                            `validation_rules.${index}.type`,
                            value as ValidationRuleType,
                          )
                        }
                        value={field.value || ''}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a validation type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ValidationRuleType).map(
                            ([key, value]) => (
                              <SelectItem key={value} value={value}>
                                {convertPascalCaseToTitleCase(key)}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {ValidationRuleTypeWithValue.includes(
                  form.watch(`validation_rules.${index}.type`),
                ) && (
                  <FormField
                    control={form.control}
                    name={`validation_rules.${index}.value`}
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
                  control={form.control}
                  name={`validation_rules.${index}.message`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder='Enter validation message'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type='button'
              className='w-full'
              variant='outline'
              onClick={() =>
                fieldArray.append({
                  type: '' as ValidationRuleType,
                  message: '',
                })
              }
            >
              <Plus />
              Add Validation
            </Button>
            <Separator />
          </>
        )}
        <Button
          className='w-full'
          type='submit'
          disabled={!form.formState.isValid}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
