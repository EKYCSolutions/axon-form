'use client';

import { cn } from '@/lib/utils';
import { type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { PageFormSchemaData } from '@/validations/PageValidation.js';

import { NodeType } from '@/configs/graph';
import type { GraphNode } from '@/types/Graph';
import { useState } from 'react';
import { useGraph } from '../../hooks/useGraph.js';
import { SelectNodeCombobox } from '../SelectNodeCombobox.js';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanProvider,
} from '../ui/shadcn-io/kanban';

interface IProps {
  className?: string;
  //
  form: UseFormReturn<PageFormSchemaData>;
  //
  onSubmit: (data: PageFormSchemaData) => void;
}

export default function GraphPageForm({ className, form, onSubmit }: IProps) {
  const { isDirty, isValid } = form.formState;
  const { nodes: nodeList, selectedNode, selectedNodes } = useGraph();

  const [nodesKanbanItem, setNodesKanbanItems] = useState(
    selectedNodes.map((n) => convertNodeToKanbanItemProps(n)),
  );

  const convertNodeToKanbanItemProps = (node: GraphNode) => {
    return {
      id: node.id,
      name: node.label,
      column: 'column_id',
    };
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-6', className)}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className='font-light text-sm'
                    placeholder='Enter the label'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    className='font-light text-sm'
                    placeholder='Enter the label'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name='field_ids'
          render={() => {
            return (
              <FormItem>
                <FormLabel>Fields</FormLabel>
                <SelectNodeCombobox
                  nodes={nodeList.filter((n) => n.nodeType == NodeType.Input)}
                  selectedNode={selectedNode}
                  onNodeSelect={(selectedNode) => {
                    const foundNode = nodesKanbanItem.find(
                      (n) => n.id == selectedNode.id,
                    );

                    if (foundNode) {
                      return;
                    }

                    const kanbanItem =
                      convertNodeToKanbanItemProps(selectedNode);

                    const updatedKanbanItems = [kanbanItem, ...nodesKanbanItem];
                    setNodesKanbanItems(updatedKanbanItems);

                    form.setValue(
                      'field_ids',
                      updatedKanbanItems.map((n) => n.id),
                      { shouldValidate: true },
                    );
                  }}
                  className='flex-1'
                />
                {nodesKanbanItem.length > 0 && (
                  <KanbanProvider
                    columns={[
                      {
                        id: 'column_id',
                        name: 'Nodes',
                        color: '#ffffff',
                      },
                    ]}
                    data={nodesKanbanItem}
                    onDataChange={setNodesKanbanItems}
                  >
                    {(column) => (
                      <KanbanBoard
                        id={column.id}
                        key={column.id}
                        className='bg-black !min-h-0'
                      >
                        <KanbanCards id={column.id}>
                          {(feature) => (
                            <KanbanCard
                              column={column.name}
                              id={feature.id}
                              key={feature.id}
                              name={feature.name}
                            />
                          )}
                        </KanbanCards>
                      </KanbanBoard>
                    )}
                  </KanbanProvider>
                )}
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button
          className='w-full'
          type='submit'
          disabled={!isValid || !isDirty}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
