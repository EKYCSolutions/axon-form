import EdgeDetail from '@/components/EdgeDetail';
import AddConditionGroupForm from '@/components/forms/AddConditionGroupForm';
import AddEdgeForm from '@/components/forms/AddEdgeForm';
import AddNodeForm from '@/components/forms/AddNodeForm';
import EditEdgeForm from '@/components/forms/EditEdgeForm';
import EditNodeForm from '@/components/forms/EditNodeForm';
import NodeDetail from '@/components/NodeDetail';
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet';
import { GraphSheetType } from '@/configs/graph';
import { PenIcon, Trash2Icon } from 'lucide-react';

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
            <div className='space-x-2'>
              <Button variant='outline' onClick={onEditNodeClick}>
                <PenIcon size={10} />
              </Button>
              <Button
                variant='outline'
                className='dark:hover:border-red-400 dark:hover:bg-red-400/20'
                onClick={onRemoveNodeClick}
              >
                <Trash2Icon className='dark:hover:text-red-400' size={10} />
              </Button>
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
            <div className='space-x-2'>
              <Button variant='outline' onClick={onEditEdgeClick}>
                <PenIcon size={10} />
              </Button>
              <Button
                variant='outline'
                className='dark:hover:border-red-400 dark:hover:bg-red-400/20'
                onClick={onRemoveEdgeClick}
              >
                <Trash2Icon className='dark:hover:text-red-400' size={10} />
              </Button>
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
