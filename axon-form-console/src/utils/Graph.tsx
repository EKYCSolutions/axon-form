import EdgeDetail from '@/components/EdgeDetail';
import AddEdgeForm from '@/components/forms/AddEdgeForm';
import AddNodeForm from '@/components/forms/AddNodeForm';
import EditEdgeForm from '@/components/forms/EditEdgeForm';
import EditNodeForm from '@/components/forms/EditNodeForm';
import NodeDetail from '@/components/NodeDetail';
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet';
import { GraphSheetType } from '@/configs/graph';
import { PenIcon } from 'lucide-react';

interface RenderSheetContentProps {
  sheetType: GraphSheetType;
  //
  onEditNodeClick: () => void;
  onEditEdgeClick: () => void;
}

export const renderSheetContent = ({
  sheetType,
  //
  onEditNodeClick,
  onEditEdgeClick,
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
            <Button variant='outline' onClick={onEditNodeClick}>
              <PenIcon size={10} />
            </Button>
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
            <Button variant='outline' onClick={onEditEdgeClick}>
              <PenIcon size={10} />
            </Button>
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
    default:
      return;
  }
};
