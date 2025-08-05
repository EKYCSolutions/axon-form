import GraphMenubar from '@/components/graphs/GraphMenuBar.js';
import GraphVisualizationWrapper from '@/components/graphs/GraphVisualizationWrapper';
import { useGraph } from '@/components/hooks/useGraph';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GraphSheetType } from '@/configs/graph';
import { cn } from '@/lib/utils';
import { renderSheetContent } from '@/utils/Graph.js';
import { useEffect } from 'react';

export default function MainPage() {
  const {
    nvlRef,
    isEdgeMode,
    sourceNode,
    targetNode,
    nodes,
    edges,
    sheetOpen,
    sheetType,
    mouseEventCallbacks,
    setNodes,
    setEdges,
    nodesQuery,
    edgesQuery,
    fetchGraphData,
    setSheetOpen,
    setSheetType,
    setSourceNode,
    setTargetNode,
  } = useGraph();

  useEffect(() => {
    fetchGraphData();
  }, [nodesQuery, edgesQuery]);

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
              onEditNodeClick: () => {
                setSheetType(GraphSheetType.EditNode);
              },
              onRemoveNodeClick: () => {
                //
              },
              onEditEdgeClick: () => {
                setSheetType(GraphSheetType.EditEdge);
              },
              onRemoveEdgeClick: () => {
                //
              },
            })}
          </div>
        </SheetContent>
      </Sheet>
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-4'>
        {isEdgeMode ? (
          <Alert className='dark:opacity-80 hover:cursor-default'>
            <AlertDescription>
              Please select a {sourceNode ? 'target' : 'source'} node to
              continue
            </AlertDescription>
          </Alert>
        ) : (
          <GraphMenubar />
        )}
      </div>
      <GraphVisualizationWrapper
        nvlRef={nvlRef}
        options={{
          initialZoom: 1.5,
          styling: {
            selectedBorderColor: '#',
            selectedInnerBorderColor: 'black',
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
