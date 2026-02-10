import { ConditionGroupExpression } from '@/configs/graph';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import { type UseFormReturn } from 'react-hook-form';

import type { GraphEdge } from '@/types/Graph';
import { convertPascalCaseToTitleCase } from '@/utils/string';
import { useGraph } from '../../hooks/useGraph.js';
import RecursiveCollapsibleConditionGroup from '../RecursiveCollapsibleConditionGroup';
import { SelectNodeCombobox } from '../SelectNodeCombobox';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
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
  form: UseFormReturn<ConditionGroupFormSchemaData>;
  onSubmit: (data: ConditionGroupFormSchemaData) => void;
}

export default function ConditionGroupForm({
  className,
  form,
  onSubmit,
}: IProps) {
  const { nodes: nodeList, selectedNode, setSelectedNode } = useGraph();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='node'
          render={() => (
            <FormItem className='mb-4'>
              <FormLabel>Node</FormLabel>
              <SelectNodeCombobox
                nodes={nodeList}
                selectedNode={selectedNode}
                onNodeSelect={(selectedNode) => {
                  setSelectedNode(selectedNode);
                  form.setValue('node', selectedNode.id, {
                    shouldValidate: true,
                  });
                }}
                className='flex-1'
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='expr'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expression</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder='Expression' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className='w-full' defaultValue={field.value}>
                  {Object.entries(ConditionGroupExpression).map(
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
        <RecursiveCollapsibleConditionGroup
          form={form}
          fieldArrayName='children'
          expression={form.watch('expr')}
          edges={form.watch('edges') as GraphEdge[]}
          children={form.watch('children')}
          //
          onAddEdge={(edge) => {
            form.setValue(
              'edges',
              form.watch('edges') ? [...form.watch('edges'), edge] : [edge],
            );
          }}
          onUpdateEdge={(edge, idx) => {
            const updatedEdges = [...form.watch('edges')];
            updatedEdges[idx] = edge;
            form.setValue('edges', updatedEdges, { shouldValidate: true });
          }}
          onRemoveEdge={(idx) => {
            const updatedEdges = [...form.watch('edges')];
            updatedEdges.splice(idx, 1);
            form.setValue('edges', updatedEdges, { shouldValidate: true });
          }}
        />
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
