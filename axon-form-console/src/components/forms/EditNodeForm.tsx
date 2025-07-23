'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { NodeFieldType, NodeType } from '@/configs/graph';
import { cn } from '@/lib/utils';
import {
  AddNodeFormSchema,
  convertGraphNodeToNodeForm,
  convertNodeFormSchemaToGraphNode,
  type AddNodeFormSchemaData,
} from '@/validations/AddNodeValidation';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface IProps {
  className?: string;
}

export default function EditNodeForm({ className }: IProps) {
  const { selectedNode, updateNode, setSheetOpen } = useGraph();

  const form = useForm<AddNodeFormSchemaData>({
    resolver: zodResolver(AddNodeFormSchema),
    defaultValues: convertGraphNodeToNodeForm(selectedNode),
  });

  function onSubmit(data: AddNodeFormSchemaData) {
    updateNode(selectedNode?.id, convertNodeFormSchemaToGraphNode(data));
    //
    setSheetOpen(false);
    toast.success('Update node successfully');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        <FormField
          control={form.control}
          name='label'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Label</FormLabel>
              <FormControl>
                <Input placeholder='Enter the label' {...field} />
              </FormControl>
              <FormDescription>This is the label for your node</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Node Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
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
        <FormField
          control={form.control}
          name='field_type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
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
        <Button type='submit'>Update</Button>
      </form>
    </Form>
  );
}
