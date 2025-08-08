import GraphMenubar from '@/components/graphs/GraphMenuBar.js';
import GraphVisualizationWrapper from '@/components/graphs/GraphVisualizationWrapper';
import { useGraph } from '@/components/hooks/useGraph';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GraphSheetType } from '@/configs/graph';
import { cn } from '@/lib/utils';
import { renderSheetContent } from '@/utils/Graph.js';

export default function MainPage() {
  const {
    nvlRef,
    sourceNode,
    targetNode,
    selectedNode,
    selectedEdge,
    nodes,
    edges,
    sheetOpen,
    sheetType,
    mouseEventCallbacks,
    setSheetOpen,
    setSheetType,
    setSourceNode,
    setTargetNode,
    removeNode,
    duplicateNode,
    removeEdge,
  } = useGraph();

  return (
    <div className='relative w-full h-full dark:bg-slate-100'>
      <Sheet
        open={sheetOpen}
        onOpenChange={(isOpen) => {
          if (targetNode && sourceNode && !isOpen) {
            setSourceNode(undefined);
            setTargetNode(undefined);
          }
          setSheetOpen(isOpen);
        }}
      >
        <SheetContent
          className={cn(
            'h-full p-4 dark:outline-none dark:bg-transparent dark:shadow-none dark:border-none [&>button:first-of-type]:hidden border-l-0',
            sheetType == GraphSheetType.AddConditionGroup && 'min-w-[50vw]',
          )}
        >
          <div className='h-full p-4 rounded-lg bg-black space-y-6 overflow-y-auto'>
            {renderSheetContent({
              sheetType: sheetType,
              //,
              onDuplicateNodeClick: () => {
                if (selectedNode) {
                  duplicateNode(selectedNode.id);
                }
              },
              onEditNodeClick: () => {
                setSheetType(GraphSheetType.EditNode);
              },
              onRemoveNodeClick: () => {
                if (selectedNode) {
                  removeNode(selectedNode.id);
                }
              },
              onEditEdgeClick: () => {
                setSheetType(GraphSheetType.EditEdge);
              },
              onRemoveEdgeClick: () => {
                if (selectedEdge) {
                  removeEdge(selectedEdge.id);
                }
              },
            })}
          </div>
        </SheetContent>
      </Sheet>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-4'>
        <GraphMenubar />
      </div>
      <GraphVisualizationWrapper
        nvlRef={nvlRef}
        options={{
          initialZoom: 1.5,
          styling: {
            selectedBorderColor: 'rgba(255, 255, 255, 0.05)',
            selectedInnerBorderColor: 'rgba(255, 255, 255, 0.05)',
          },
          layout: 'hierarchical',
        }}
        nodes={nodes}
        edges={edges}
        mouseEventCallbacks={mouseEventCallbacks}
      />
    </div>
  );
}
