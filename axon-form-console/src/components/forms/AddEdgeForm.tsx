import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { EdgeType } from '@/configs/graph';
import { cn } from '@/lib/utils';
import { convertPascalCaseToTitleCase } from '@/utils/string.js';
import {
  EdgeFormSchema,
  EdgeFormSchemaDefaultValue,
  type EdgeFormSchemaData,
} from '@/validations/EdgeValidation.js';
import { useEffect } from 'react';
import { toast } from 'sonner';
import FormHeader from '../FormHeader.js';
import { useGraph } from '../hooks/useGraph.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.js';
import { Separator } from '../ui/separator.js';

interface IProps {
  className?: string;
}

export default function AddEdgeForm({ className }: IProps) {
  const {
    sourceNode,
    targetNode,
    addEdge,
    setSheetOpen,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
  } = useGraph();

  const form = useForm<EdgeFormSchemaData>({
    resolver: zodResolver(EdgeFormSchema),
    defaultValues: EdgeFormSchemaDefaultValue,
  });

  function onSubmit(data: EdgeFormSchemaData) {
    addEdge(data);
    form.reset();
    //
    setSheetOpen(false);
    toast.success('Added edge successfully');
  }

  useEffect(() => {
    if (sourceNode) {
      form.setValue('source_node', sourceNode.id);
    }
    //
    if (targetNode) {
      form.setValue('target_node', targetNode.id);
    }
  }, [sourceNode, targetNode]);

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
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='w-full'>
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
        <Separator />
        <FormHeader title='Node' />
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
