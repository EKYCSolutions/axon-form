import { cn } from '@/lib/utils';
import { type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ConditionExpression, EdgeType } from '@/configs/graph';
import { convertPascalCaseToTitleCase } from '@/utils/string';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation';
import { Plus, Trash2Icon } from 'lucide-react';
import { useGraph } from '../hooks/useGraph';
import { Input } from '../ui/input';
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
  form: UseFormReturn<EdgeFormSchemaData>;
  fieldArray: UseFieldArrayReturn<EdgeFormSchemaData>;
  //
  onSubmit: (data: EdgeFormSchemaData) => void;
}

export default function EdgeForm({
  className,
  form,
  fieldArray,
  onSubmit,
}: IProps) {
  const {
    sourceNode,
    targetNode,
    setSheetOpen,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
  } = useGraph();
  //
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        <FormField
          control={form.control}
          name='source_node'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Node</FormLabel>
              <FormControl>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => {
                    setIsEdgeMode(true);
                    setSourceNode(undefined);
                    setTargetNode(undefined);
                    //
                    setSheetOpen(false);
                  }}
                >
                  {sourceNode ? sourceNode.id : 'Select source node'}
                </Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='target_node'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Node</FormLabel>
              <FormControl>
                <Button type='button' variant='secondary' className=''>
                  {targetNode ? targetNode.id : 'Select target node'}
                </Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edge Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select an edge type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='w-full' defaultValue={field.value}>
                  {Object.entries(EdgeType).map(([key, value]) => (
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
        {form.watch('type') === EdgeType.Shows && (
          <>
            <Separator />
            <FormLabel>Edge Conditions</FormLabel>
            {fieldArray.fields.map((field, index) => (
              <div key={index} className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <FormLabel className='font-light'>
                    Condition {index + 1}
                  </FormLabel>
                  <Button
                    type='button'
                    variant='outline'
                    className='p-0 dark:border-red-400/50 dark:hover:bg-red-400/20'
                    onClick={() => fieldArray.remove(index)}
                  >
                    <Trash2Icon className='text-red-400/50' />
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name={`conditions.${index}.expr`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) =>
                          form.setValue(
                            `conditions.${index}.expr`,
                            value as ConditionExpression,
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
                          {Object.entries(ConditionExpression).map(
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
                <FormField
                  control={form.control}
                  name={`conditions.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='Enter condition value' {...field} />
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
                  expr: '' as ConditionExpression,
                  value: '',
                })
              }
            >
              <Plus />
              Add Validation
            </Button>
          </>
        )}
        <Separator />
        <Button
          type='submit'
          className='w-full'
          disabled={!form.formState.isValid}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
