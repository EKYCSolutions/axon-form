import AddNodeForm from '@/components/forms/AddNodeForm';
import GraphVisualizationWrapper from '@/components/graphs/GraphVisualizationWrapper';
import GraphMenubar from '@/components/graphs/MenuBar';
import { useGraph } from '@/components/hooks/useGraph';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { allPeeps } from '@/services/PocketBaseService';
import { useQuery } from '@tanstack/react-query';

export default function MainPage() {
  const { data, status } = useQuery({ queryKey: ['peeps'], queryFn: allPeeps });
  const {
    nvlRef,
    nodes,
    relationships,
    sheetOpen,
    sheetType,
    mouseEventCallbacks,
    addNode,
    setSheetOpen,
  } = useGraph();

  return (
    <div className='relative w-full h-full p-4 dark:bg-slate-100'>
      <div className='space-x-2'>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className='h-full p-4 dark:bg-transparent dark:shadow-none dark:border-none [&>button:first-of-type]:hidden'>
            <AddNodeForm
              className='h-full p-4 rounded-lg bg-black'
              addNode={addNode}
            />
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
        relationships={relationships}
        mouseEventCallbacks={mouseEventCallbacks}
      />
    </div>
  );
}
