import AddNodeForm from '@/components/forms/AddNodeForm';
import EditNodeForm from '@/components/forms/EditNodeForm';
import GraphVisualizationWrapper from '@/components/graphs/GraphVisualizationWrapper';
import GraphMenubar from '@/components/graphs/MenuBar';
import { useGraph } from '@/components/hooks/useGraph';
import NodeDetail from '@/components/NodeDetail';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { GraphSheetType } from '@/configs/graph';
import { allPeeps } from '@/services/PocketBaseService';
import { useQuery } from '@tanstack/react-query';
import { PenIcon } from 'lucide-react';

export default function MainPage() {
  const { data, status } = useQuery({ queryKey: ['peeps'], queryFn: allPeeps });
  const {
    nvlRef,
    nodes,
    edges,
    sheetOpen,
    sheetType,
    mouseEventCallbacks,
    setSheetOpen,
    setSheetType,
  } = useGraph();

  const renderSheetContent = () => {
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
              <SheetTitle className='text-xl font-medium'>
                Node Detail
              </SheetTitle>
              <Button
                variant='outline'
                onClick={() => {
                  setSheetType(GraphSheetType.EditNode);
                }}
              >
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

      default:
        return;
    }
  };

  return (
    <div className='relative w-full h-full p-4 dark:bg-slate-100'>
      <div className='space-x-2'>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className='h-full p-4 dark:outline-none dark:bg-transparent dark:shadow-none dark:border-none [&>button:first-of-type]:hidden border-l-0'>
            <div className='h-full p-4 rounded-lg bg-black space-y-6'>
              {renderSheetContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-50'>
        <GraphMenubar />
      </div>
      <GraphVisualizationWrapper
        nvlRef={nvlRef}
        options={{ initialZoom: 1 }}
        nodes={nodes}
        edges={edges}
        mouseEventCallbacks={mouseEventCallbacks}
      />
    </div>
  );
}
