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
  AddNodeFormSchemaDefaultValue,
  type AddNodeFormSchemaData,
} from '@/validations/AddNodeValidation';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface IProps {
  className: string;
  addNode: (data: AddNodeFormSchemaData) => void;
}

export default function AddNodeForm({ className, addNode }: IProps) {
  const form = useForm<AddNodeFormSchemaData>({
    resolver: zodResolver(AddNodeFormSchema),
    defaultValues: AddNodeFormSchemaDefaultValue,
  });

  function onSubmit(data: AddNodeFormSchemaData) {
    addNode(data);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        <DialogTitle className='text-xl font-medium'>Add Node</DialogTitle>
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
