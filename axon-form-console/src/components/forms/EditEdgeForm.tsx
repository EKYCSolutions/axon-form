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
import { EdgeType } from '@/configs/graph.js';
import { cn } from '@/lib/utils';
import { convertPascalCaseToTitleCase } from '@/utils/string.js';
import {
  EdgeFormSchema,
  type EdgeFormSchemaData,
} from '@/validations/EdgeValidation.js';
import { convertGraphEdgeToEdgeForm } from '@/validations/NodeValidation.js';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph.js';
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

export default function EditEdgeForm({ className }: IProps) {
  const {
    selectedEdge,
    updateEdge,
    setSheetOpen,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
  } = useGraph();

  if (!selectedEdge) {
    return;
  }

  const form = useForm<EdgeFormSchemaData>({
    resolver: zodResolver(EdgeFormSchema),
    defaultValues: convertGraphEdgeToEdgeForm(selectedEdge),
  });

  function onSubmit(data: EdgeFormSchemaData) {
    if (!selectedEdge?.id) {
      return;
    }

    updateEdge(selectedEdge?.id, data);
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
                  {field.value}
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
                  {field.value}
                </Button>
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
        <Button type='submit' className='w-full'>
          Update
        </Button>
      </form>
    </Form>
  );
}
