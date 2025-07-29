import GraphMenubar from '@/components/graphs/GraphMenuBar.js';
import GraphVisualizationWrapper from '@/components/graphs/GraphVisualizationWrapper';
import { useGraph } from '@/components/hooks/useGraph';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { GraphSheetType } from '@/configs/graph';
import { getAllEdges, getAllNodes } from '@/services/PocketBaseService';
import type { GraphEdge, GraphNode } from '@/types/Graph';
import type { EdgeResponse } from '@/types/PocketBaseResponse';
import { renderSheetContent } from '@/utils/Graph';
import { convertEdgeResponseToGraphEdge } from '@/validations/EdgeValidation';
import { convertNodeFormSchemaToGraphNode } from '@/validations/NodeValidation';
import { useQueries } from '@tanstack/react-query';
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
    setSheetOpen,
    setSheetType,
  } = useGraph();

  const [nodesQuery, edgesQuery] = useQueries({
    queries: [
      {
        queryKey: ['nodes'],
        queryFn: getAllNodes,
      },
      {
        queryKey: ['edges'],
        queryFn: getAllEdges,
      },
    ],
  });

  useEffect(() => {
    if (nodesQuery.status == 'success' && nodes.length === 0) {
      const nodeRes: GraphNode[] = nodesQuery.data.items.map((node) =>
        convertNodeFormSchemaToGraphNode(node),
      );

      setNodes(nodeRes);
    }
    if (edgesQuery.status == 'success' && edges.length === 0) {
      const edgeRes: GraphEdge[] = edgesQuery.data.items.map(
        (edge: EdgeResponse) => convertEdgeResponseToGraphEdge(edge),
      );

      setEdges(edgeRes);
    }
  }, [nodesQuery, edgesQuery]);

  return (
    <div className='relative w-full h-full dark:bg-slate-100'>
      <div className='space-x-2'>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className='h-full p-4 dark:outline-none dark:bg-transparent dark:shadow-none dark:border-none [&>button:first-of-type]:hidden border-l-0'>
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
      </div>
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
          initialZoom: 1,
          styling: {
            selectedBorderColor: '#',
            selectedInnerBorderColor: 'black',
          },
        }}
        nodes={nodes}
        edges={edges}
        mouseEventCallbacks={mouseEventCallbacks}
      />
    </div>
  );
}
