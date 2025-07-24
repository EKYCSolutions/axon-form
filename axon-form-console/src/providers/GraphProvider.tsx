import {
  EdgeType,
  GraphSheetType,
  NodeFieldType,
  NodeType,
} from '@/configs/graph';
import { GraphContext, type GraphContextType } from '@/contexts/GraphContext';
import {
  createEdge as createEdgeService,
  createNode as createNodeService,
  updateEdge as updateEdgeService,
  updateNode as updateNodeService,
} from '@/services/PocketBaseService';
import type { GraphEdge, GraphNode } from '@/types/Graph.js';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation.js';
import { type NodeFormSchemaData } from '@/validations/NodeValidation.js';
import type { HitTargets, Node, NVL, Relationship } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface GraphProviderProps {
  children: ReactNode;
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
}

const DEFAULT_ZOOM_LEVEL = 0.75;

export function GraphProvider({
  children,
  initialNodes = [
    {
      id: '0',
      label: 'graphs',
      caption: 'graphs',
      nodeType: NodeType.Input,
      fieldType: NodeFieldType.Checkbox,
    },
    {
      id: '1',
      label: 'input',
      caption: 'input',
      nodeType: NodeType.Input,
      fieldType: NodeFieldType.Checkbox,
    },
    {
      id: '2',
      label: 'option',
      caption: 'option',
      nodeType: NodeType.Options,
      fieldType: NodeFieldType.Dropdown,
    },
    {
      id: '3',
      label: 'value',
      caption: 'value',
      nodeType: NodeType.Values,
      fieldType: NodeFieldType.File,
    },
    {
      id: '4',
      label: 'checkbox',
      caption: 'checkbox',
      nodeType: NodeType.Input,
      fieldType: NodeFieldType.Checkbox,
    },
    {
      id: '5',
      label: 'text',
      caption: 'text',
      nodeType: NodeType.Input,
      fieldType: NodeFieldType.Text,
    },
  ],
  initialEdges = [
    {
      from: '0',
      to: '1',
      id: '10',
      caption: 'are',
      sourceNode: '1',
      targetNode: '3',
      edgeType: EdgeType.HasOption,
    },
    {
      from: '2',
      to: '3',
      id: '11',
      caption: 'child',
      sourceNode: '1',
      targetNode: '3',
      edgeType: EdgeType.HasOption,
    },
  ],
}: GraphProviderProps) {
  const nvlRef = useRef<NVL | null>(null);

  // Graph data state
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);

  // UI state
  const [selectedNode, setSelectedNode] = useState<GraphNode | undefined>();
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | undefined>();
  const [zoom, setZoom] = useState<number>(100);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<GraphSheetType>(
    GraphSheetType.AddNode,
  );

  // Edge creation state
  const [isEdgeMode, setIsEdgeMode] = useState<boolean>(false);
  const [sourceNode, setSourceNode] = useState<GraphNode | undefined>();
  const [targetNode, setTargetNode] = useState<GraphNode | undefined>();

  // Helper function to update graph visualization
  const updateGraphVisualization = useCallback(
    (newNodes: GraphNode[], newEdges: GraphEdge[]) => {
      nvlRef.current?.addElementsToGraph(newNodes, newEdges);
    },
    [],
  );

  // Helper function to handle errors
  const handleError = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(errorMessage);
    console.error('Graph operation error:', error);
  }, []);

  // Edge creation helpers
  const resetEdgeCreation = useCallback(() => {
    setSourceNode(undefined);
    setTargetNode(undefined);
    setIsEdgeMode(false);
  }, []);

  const handleEdgeModeNodeClick = useCallback(
    (foundNode: GraphNode | undefined) => {
      if (!foundNode) return;

      if (!sourceNode) {
        console.log('Setting source node:', foundNode);
        setSourceNode(foundNode);
        return;
      }

      if (!targetNode && foundNode.id !== sourceNode.id) {
        console.log('Setting target node:', foundNode);
        setTargetNode(foundNode);
        setSheetOpen(true);
        return;
      }
    },
    [sourceNode, targetNode],
  );

  // Mouse event callbacks
  const mouseEventCallbacks: MouseEventCallbacks = {
    onHover: useCallback(
      (
        element: Node | Relationship,
        hitElements: HitTargets,
        event: MouseEvent,
      ) => {},
      [],
    ),
    onNodeClick: useCallback(
      (node: Node, hitTargets: HitTargets, evt: MouseEvent) => {
        console.log('onNodeClick', node, hitTargets, evt);

        const foundNode = nodes.find((n) => n.id === node.id);
        setSelectedNode(foundNode);

        if (isEdgeMode) {
          handleEdgeModeNodeClick(foundNode);
          return;
        }

        // Open node detail sheet in normal mode
        setSheetOpen(true);
        setSheetType(GraphSheetType.ShowNode);
      },
      [nodes, isEdgeMode, handleEdgeModeNodeClick],
    ),

    onRelationshipClick: useCallback(
      (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) => {
        console.log('onRelationshipClick', rel, hitTargets, evt);

        const foundEdge = edges.find((e) => e.id === rel.id);
        setSelectedEdge(foundEdge);

        //
        setSheetOpen(true);
        setSheetType(GraphSheetType.ShowEdge);
      },
      [],
    ),

    onDrag: useCallback((draggedNodes: Node[]) => {
      console.log('onDrag', draggedNodes);
    }, []),

    onPan: useCallback(
      (_panning: { x: number; y: number }, evt: MouseEvent) => {
        console.log('onPan', _panning, evt);
      },
      [],
    ),

    onZoom: useCallback((zoomLevel: number) => {
      console.log('onZoom', zoomLevel);
      const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
      setZoom(zoomLevelCleaned);
    }, []),
  };

  // Graph operations
  const addNode = useCallback(
    async (data: NodeFormSchemaData) => {
      const tempId = uuidv4();
      let newNode: GraphNode = {
        id: tempId,
        caption: data.label,
        label: data.label,
        fieldType: data.field_type,
        nodeType: data.type,
      };

      try {
        const addNodeRes = await createNodeService(data);
        console.log('Node created successfully:', addNodeRes);

        newNode = {
          ...newNode,
          id: addNodeRes.id,
        };

        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        updateGraphVisualization(newNodes, edges);
      } catch (error) {
        handleError(error);
      }
    },
    [nodes, edges, updateGraphVisualization, handleError],
  );

  const addEdge = useCallback(
    async (data: EdgeFormSchemaData) => {
      const newEdge: GraphEdge = {
        id: uuidv4(),
        from: data.source_node,
        to: data.target_node,
        sourceNode: data.source_node,
        targetNode: data.target_node,
        edgeType: EdgeType.HasOption,
        caption: data.edge_type || '',
      };

      try {
        await createEdgeService(data);
        console.log('Edge created successfully');

        const newEdges = [...edges, newEdge];
        setEdges(newEdges);
        updateGraphVisualization(nodes, newEdges);
        resetEdgeCreation();
      } catch (error) {
        handleError(error);
      }
    },
    [edges, nodes, updateGraphVisualization, handleError, resetEdgeCreation],
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      const newNodes = nodes.filter((node) => node.id !== nodeId);
      const newEdges = edges.filter(
        (edge) => edge.from !== nodeId && edge.to !== nodeId,
      );

      setNodes(newNodes);
      setEdges(newEdges);
      updateGraphVisualization(newNodes, newEdges);
    },
    [nodes, edges, updateGraphVisualization],
  );

  const removeEdge = useCallback(
    (edgeId: string) => {
      const newEdges = edges.filter((edge) => edge.id !== edgeId);
      setEdges(newEdges);
      updateGraphVisualization(nodes, newEdges);
    },
    [edges, nodes, updateGraphVisualization],
  );

  const updateNode = useCallback(
    async (nodeId: string, updates: NodeFormSchemaData) => {
      const newNodes = nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              ...updates,
              //
              // This is applied to update the label display on the graph (NVL Library uses caption)
              caption: updates.label,
            }
          : node,
      );

      try {
        await updateNodeService(nodeId, updates);
        console.log('Edge updated successfully');
      } catch (error) {
        handleError(error);
      }

      setNodes(newNodes);
      updateGraphVisualization(newNodes, edges);
    },
    [nodes, edges, updateGraphVisualization, handleError],
  );

  const updateEdge = useCallback(
    async (edgeId: string, updates: EdgeFormSchemaData) => {
      // const newEdges = edges.map((edge) =>
      //   edge.id === edgeId ? { ...edge, ...updates } : edge,
      // );
      const newEdges = edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              ...updates,
              //
              // This is applied to update the label display on the graph (NVL Library uses caption)
              caption: updates.edge_type,
            }
          : edge,
      );

      try {
        await updateEdgeService(edgeId, updates);
        console.log('Edge updated successfully');
      } catch (error) {
        handleError(error);
      }

      setEdges(newEdges);
      updateGraphVisualization(nodes, newEdges);
    },
    [edges, nodes, updateGraphVisualization, handleError],
  );

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    updateGraphVisualization([], []);
  }, [updateGraphVisualization]);

  const resetZoom = useCallback(() => {
    nvlRef.current?.resetZoom();
    const zoomLevelCleaned = Math.ceil(DEFAULT_ZOOM_LEVEL * 100);
    setZoom(zoomLevelCleaned);
  }, []);

  const updateZoom = useCallback((zoomLevel: number) => {
    nvlRef.current?.setZoom(zoomLevel);
    const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
    setZoom(zoomLevelCleaned);
  }, []);

  // Context value
  const value: GraphContextType = {
    // Refs
    nvlRef,

    // Data
    nodes,
    edges,

    // UI state
    selectedNode,
    selectedEdge,
    zoom,
    sheetOpen,
    sheetType,

    // Edge creation state
    isEdgeMode,
    sourceNode,
    targetNode,

    // Setters
    setSelectedNode,
    setSelectedEdge,
    setSheetOpen,
    setSheetType,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
    setNodes,
    setEdges,

    // Operations
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    updateNode,
    updateEdge,
    clearGraph,
    resetZoom,
    updateZoom,

    // Event handlers
    mouseEventCallbacks,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}
