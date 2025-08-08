import { ConditionGroupExpression } from '@/configs/graph';
import type { GraphEdge } from '@/types/Graph';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation.js';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import DeleteButton from './DeleteButton.js';
import { useGraph } from './hooks/useGraph.js';
import { SelectEdgeCombobox } from './SelectEdgeCombobox.js';
import { Button } from './ui/button.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.js';

type FieldArrayName =
  | 'edges'
  | 'children'
  | `children.${number}.edges`
  | `children.${number}.children`
  | `children.${number}.children.${string}`;

interface IProps {
  form: UseFormReturn<ConditionGroupFormSchemaData>;
  fieldArrayName: string;
  //
  expression?: ConditionGroupExpression;
  edges: GraphEdge[];
  children?: IProps[];
  //
  onAddEdge: (edge: GraphEdge | undefined) => void;
  onUpdateEdge: (edge: GraphEdge, idx: number) => void;
  onRemoveEdge: (idx: number) => void;
}

export default function RecursiveCollapsibleConditionGroup({
  form,
  fieldArrayName,
  //
  expression,
  edges,
  //
  onAddEdge,
  onUpdateEdge,
  onRemoveEdge,
}: IProps) {
  const CONDITION_GROUP_LEVEL_LIMIT = 1;
  const conditionGroupLevel = fieldArrayName.split('.').length - 1;
  //
  const currentFieldArrayName = fieldArrayName ?? 'children';
  //
  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: currentFieldArrayName as FieldArrayName,
  });

  const { edges: edgeList } = useGraph();

  return (
    <Collapsible className='flex w-full flex-col gap-2'>
      <div className='w-full flex gap-2'>
        <CollapsibleTrigger
          asChild
          disabled={edges.length == 0 && fields.length == 0}
        >
          <Button
            type='button'
            variant='secondary'
            size='icon'
            className='flex-1'
          >
            <p>{expression ? expression.toUpperCase() : 'Select Expression'}</p>
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
        <Button
          variant='outline'
          onClick={() => onAddEdge(undefined)}
          disabled={expression == undefined}
        >
          <Plus />
          Edge
        </Button>
        {conditionGroupLevel < CONDITION_GROUP_LEVEL_LIMIT && (
          <Button
            variant='outline'
            onClick={() =>
              append({
                expr: '' as ConditionGroupExpression,
                edges: [],
              })
            }
            disabled={expression == undefined}
          >
            <Plus />
            Condition Group
          </Button>
        )}
      </div>
      <CollapsibleContent className='flex flex-col gap-2 border-l-3 pl-3 ml-3'>
        {edges.length > 0 && (
          <>
            <p>Edges</p>
            {edges.map((edge, idx) => {
              return (
                <div key={idx} className='flex items-center w-full gap-2'>
                  <SelectEdgeCombobox
                    idx={idx}
                    edges={edgeList}
                    selectedEdges={edges}
                    onEdgeSelect={(selectedEdge) => {
                      onUpdateEdge(selectedEdge, idx);
                    }}
                    className='flex-1'
                  />
                  <DeleteButton
                    onClick={() => {
                      onRemoveEdge(idx);
                    }}
                    showConfirmationDialog={false}
                  />
                </div>
              );
            })}
          </>
        )}
        {fields.length > 0 && (
          <>
            {fields.map((child, idx) => {
              return (
                <div key={idx} className='space-y-2'>
                  <p>Condition Group {idx + 1}</p>
                  <div className='flex space-x-2'>
                    <Select
                      onValueChange={(expr) =>
                        update(idx, {
                          ...child,
                          expr: expr as ConditionGroupExpression,
                        })
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select field type' />
                      </SelectTrigger>
                      <SelectContent className='w-full'>
                        {Object.entries(ConditionGroupExpression).map(
                          ([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {key}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <DeleteButton onClick={() => remove(idx)} />
                  </div>
                  <RecursiveCollapsibleConditionGroup
                    key={idx}
                    //
                    form={form}
                    fieldArrayName={`${currentFieldArrayName}.${idx}`}
                    //
                    expression={child.expr}
                    edges={child.edges as GraphEdge[]}
                    children={undefined}
                    //
                    onAddEdge={(edge) =>
                      update(idx, {
                        ...child,
                        edges: [...child.edges, edge],
                      })
                    }
                    onUpdateEdge={(edge, edgeIdx) => {
                      const updatedEdges = [...child.edges];
                      updatedEdges[edgeIdx] = edge;
                      update(idx, {
                        ...child,
                        edges: updatedEdges,
                      });
                    }}
                    onRemoveEdge={(edgeIdx) => {
                      const updatedEdges = [...child.edges];
                      updatedEdges.splice(edgeIdx, 1);
                      update(idx, {
                        ...child,
                        edges: updatedEdges,
                      });
                    }}
                  />
                </div>
              );
            })}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
