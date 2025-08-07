import DeleteButton from '@/components/DeleteButton';
import EdgeDetail from '@/components/EdgeDetail';
import AddConditionGroupForm from '@/components/forms/AddConditionGroupForm';
import AddEdgeForm from '@/components/forms/AddEdgeForm';
import AddNodeForm from '@/components/forms/AddNodeForm';
import EditEdgeForm from '@/components/forms/EditEdgeForm';
import EditNodeForm from '@/components/forms/EditNodeForm';
import NodeDetail from '@/components/NodeDetail';
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet';
import {
  ConditionGroupExpression,
  EdgeType,
  GraphSheetType,
} from '@/configs/graph';
import type { GraphEdge } from '@/types/Graph';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import { PenIcon } from 'lucide-react';

interface RenderSheetContentProps {
  sheetType: GraphSheetType;
  //
  onEditNodeClick: () => void;
  onRemoveNodeClick: () => void;
  //
  onEditEdgeClick: () => void;
  onRemoveEdgeClick: () => void;
}

export const renderSheetContent = ({
  sheetType,
  //
  onEditNodeClick,
  onRemoveNodeClick,
  //
  onEditEdgeClick,
  onRemoveEdgeClick,
}: RenderSheetContentProps) => {
  switch (sheetType) {
    case GraphSheetType.AddNode:
      return (
        <>
          <SheetTitle className='text-xl font-medium'>Add Node</SheetTitle>
          <AddNodeForm />
        </>
      );
    case GraphSheetType.ShowNode:
      return (
        <>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-xl font-medium'>Node Detail</SheetTitle>
            <div className='space-x-2 flex items-center'>
              <Button variant='outline' onClick={onEditNodeClick}>
                <PenIcon size={10} />
              </Button>
              <DeleteButton onClick={onRemoveNodeClick} />
            </div>
          </div>
          <NodeDetail />
        </>
      );
    case GraphSheetType.EditNode:
      return (
        <>
          <SheetTitle className='text-xl font-medium'>Edit Node</SheetTitle>
          <EditNodeForm />
        </>
      );
    case GraphSheetType.AddEdge:
      return (
        <>
          <SheetTitle className='text-xl font-medium'>Add Edge</SheetTitle>
          <AddEdgeForm />
        </>
      );

    case GraphSheetType.ShowEdge:
      return (
        <>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-xl font-medium'>Edge Detail</SheetTitle>
            <div className='space-x-2 flex items-center'>
              <Button variant='outline' onClick={onEditEdgeClick}>
                <PenIcon size={10} />
              </Button>

              <DeleteButton onClick={onRemoveEdgeClick} />
            </div>
          </div>
          <EdgeDetail />
        </>
      );
    case GraphSheetType.EditEdge:
      return (
        <>
          <SheetTitle className='text-xl font-medium'>Edit Edge</SheetTitle>
          <EditEdgeForm />
        </>
      );
    case GraphSheetType.AddConditionGroup:
      return (
        <>
          <SheetTitle className='text-xl font-medium'>
            Add Condition Group
          </SheetTitle>
          <AddConditionGroupForm />
        </>
      );
    default:
      return;
  }
};

export const convertConditionGroupToConditionString = (
  data: ConditionGroupFormSchemaData,
): string => {
  const parts: string[] = [];

  // Add edge IDs from current level
  if (data.edges && data.edges.length > 0) {
    // Get unique edge IDs (in case there are duplicates)
    const uniqueEdgeIds = [...new Set(data.edges.map((edge) => edge.id))];
    parts.push(...uniqueEdgeIds);
  }

  // Process children recursively
  if (data.children && data.children.length > 0) {
    for (const child of data.children) {
      const childExpression = convertConditionGroupToConditionString(child);

      // Wrap child expressions in parentheses if they contain operators
      if (child.expr && (child.edges.length > 1 || child.children)) {
        parts.push(`(${childExpression})`);
      } else {
        parts.push(childExpression);
      }
    }
  }

  // Join parts with the current node's operator
  if (parts.length > 1) {
    return parts.join(` ${data.expr.toUpperCase()} `);
  } else if (parts.length === 1) {
    return parts[0];
  } else {
    return '';
  }
};

export const convertConditionStringToConditionGroupObject = (
  conditionString: string,
): ConditionGroupFormSchemaData => {
  const POCKETBASE_ID_LENGTH = 15;

  console.log('condition string >>', conditionString);
  // Trim whitespace
  let trimmed = conditionString.trim();

  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    trimmed = trimmed.slice(1, -1);
  }

  console.log('trimmed >>', trimmed);

  //
  let expr: ConditionGroupExpression;
  let delimiter: string;

  if (trimmed.includes(' AND ')) {
    expr = ConditionGroupExpression.And;
    delimiter = ' AND ';
  } else if (trimmed.includes(' OR ')) {
    expr = ConditionGroupExpression.Or;
    delimiter = ' OR ';
  } else if (trimmed.includes(' NOR ')) {
    expr = ConditionGroupExpression.Nor;
    delimiter = ' NOR ';
  } else if (trimmed.includes(' NOT ')) {
    expr = ConditionGroupExpression.Not;
    delimiter = ' NOT ';
  } else {
    throw Error('Invalid condition string');
  }

  console.log('delimiter >>', delimiter);

  // Split the string to get individual UUIDs
  const children = delimiter ? trimmed.split(delimiter) : [trimmed];

  console.log('children >>', children);

  //
  const edgeIds = children
    .map((child) => child.trim())
    .filter((child) => child.length <= POCKETBASE_ID_LENGTH);

  const conditionGroupChildren = children
    .map((child) => child.trim())
    .filter((child) => child.length > POCKETBASE_ID_LENGTH);

  //
  const edges: GraphEdge[] = edgeIds.map((id) => ({
    id: id,
    label: '',
    sourceNode: '',
    targetNode: '',
    from: '',
    to: '',
    edgeType: EdgeType.Shows,
  }));

  const conditionGroupChildrenObjects = conditionGroupChildren.map((child) =>
    convertConditionStringToConditionGroupObject(child),
  );

  return {
    expr,
    children: conditionGroupChildrenObjects,
    edges,
  };
};
