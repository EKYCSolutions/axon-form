import { GraphSheetType } from '@/configs/graph';
import { CopyPlusIcon, PenIcon } from 'lucide-react';
import CustomAlertDialog from './CustomAlertDialog';
import DeleteButton from './DeleteButton';
import EdgeDetail from './EdgeDetail';
import NodeDetail from './NodeDetail';
import AddConditionGroupForm from './forms/AddConditionGroupForm';
import AddEdgeForm from './forms/AddEdgeForm';
import AddNodeForm from './forms/AddNodeForm';
import EditEdgeForm from './forms/EditEdgeForm';
import EditNodeForm from './forms/EditNodeForm';
import { Button } from './ui/button';
import { SheetTitle } from './ui/sheet';

interface IProps {
  sheetType: GraphSheetType;
  //
  onEditNodeClick: () => void;
  onRemoveNodeClick: () => void;
  onDuplicateNodeClick: () => void;
  //
  onEditEdgeClick: () => void;
  onRemoveEdgeClick: () => void;
}

export default function RenderSheetContent({
  sheetType,
  onEditNodeClick,
  onRemoveNodeClick,
  onDuplicateNodeClick,
  onEditEdgeClick,
  onRemoveEdgeClick,
}: IProps) {
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
              <CustomAlertDialog
                title='Duplicate the selected items?'
                description='This will create an exact copy of these items with all its current settings and data.'
                continueText='Duplicate'
                onContinueClick={onDuplicateNodeClick}
              >
                <div className="h-9 px-4 py-2 has-[>svg]:px-3 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ">
                  <CopyPlusIcon />
                </div>
              </CustomAlertDialog>
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
}
