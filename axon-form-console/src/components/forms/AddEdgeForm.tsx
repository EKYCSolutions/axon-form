'use client';

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
import {
  AddEdgeFormSchema,
  AddEdgeFormSchemaDefaultValue,
  type AddEdgeFormSchemaData,
} from '@/validations/AddEdgeValidation.js';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph.js';
import ReadonlyContainer from '../ReadonlyContainer.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.js';

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

  const form = useForm<AddEdgeFormSchemaData>({
    resolver: zodResolver(AddEdgeFormSchema),
    defaultValues: AddEdgeFormSchemaDefaultValue,
  });

  function onSubmit(data: AddEdgeFormSchemaData) {
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
                {targetNode ? (
                  <ReadonlyContainer text={sourceNode?.id} />
                ) : (
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
                    Select source node
                  </Button>
                )}
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
                {targetNode ? (
                  <ReadonlyContainer text={targetNode.id} />
                ) : (
                  <Button type='button' variant='secondary' className=''>
                    Select target node
                  </Button>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='edge_type'
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
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-fullad' type='submit'>
          Submit
        </Button>
      </form>
    </Form>
  );
}
