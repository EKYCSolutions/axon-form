/* eslint-disable @typescript-eslint/no-unused-vars */
import { EdgeType, GraphSheetType } from '@/configs/graph';
import { GraphContext, type GraphContextType } from '@/contexts/GraphContext';
import {
  createConditionGroup as createConditionGroupService,
  createCondition as createConditionService,
  createEdge as createEdgeService,
  createNode as createNodeService,
  getAllNodes,
  updateEdge as updateEdgeService,
  updateNode as updateNodeService,
} from '@/services/PocketBaseService';
import type { GraphEdge, GraphNode } from '@/types/Graph.js';
import type { NodeResponse } from '@/types/PocketBaseResponse';
import { generateRandomRgbColor } from '@/utils/Color';
import { convertConditionGroupToConditionString } from '@/utils/Graph';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import { type EdgeFormSchemaData } from '@/validations/EdgeValidation.js';
import {
  convertNodeResponseToGraphNode,
  type NodeFormSchemaData,
} from '@/validations/NodeValidation.js';
import type { HitTargets, Node, NVL, Relationship } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { useQueries } from '@tanstack/react-query';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
  initialNodes = [],
  initialEdges = [],
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

  // Search state
  const [searchText, setSearchText] = useState<string>('');

  const [nodesQuery] = useQueries({
    queries: [
      {
        queryKey: ['nodes', searchText],
        queryFn: () => getAllNodes(searchText),
      },
    ],
  });

  useEffect(() => {
    if (nodesQuery.status === 'success' && nodesQuery.data?.items) {
      console.log('Fetching nodes data from query');

      const nodeRes: GraphNode[] = nodesQuery.data.items.map(
        (node: NodeResponse) => convertNodeResponseToGraphNode(node),
      );

      const edgeRes: GraphEdge[] = nodeRes
        .filter((node) => node.edges.length > 0)
        .flatMap((node) => node.edges);

      const ids = new Set();
      const uniqueEdges = edgeRes.filter(
        ({ id }) => !ids.has(id) && ids.add(id),
      );

      setNodes(nodeRes);
      setEdges(uniqueEdges);
    }
  }, [nodesQuery.status, nodesQuery.data]); // Only depend on query status and data

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
        setIsEdgeMode(false);
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
      ) => {
        // console.log('hit element >>', hitElements);
      },
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
        //
        console.log('onRelationshipClick', rel, hitTargets, evt);

        const foundEdge = edges.find((e) => e.id === rel.id);
        setSelectedEdge(foundEdge);

        //
        setSheetOpen(true);
        setSheetType(GraphSheetType.ShowEdge);
      },
      [edges],
    ),

    onDrag: useCallback((draggedNodes: Node[]) => {
      // console.log('onDrag', draggedNodes);
    }, []),

    onPan: useCallback(
      (_panning: { x: number; y: number }, evt: MouseEvent) => {
        // console.log('onPan', _panning, evt);
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
        validations: data.validation_rules,
        color: generateRandomRgbColor(data.type),
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
        console.log('new nodes >>', newNodes);
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
        label: data.label,
        from: data.source_node,
        to: data.target_node,
        sourceNode: data.source_node,
        targetNode: data.target_node,
        edgeType: EdgeType.HasOption,
        caption: data.label || '',
      };

      try {
        const addEdgeRes = await createEdgeService(data);
        console.log('Edge created successfully', addEdgeRes);

        if (data.type == EdgeType.Shows) {
          data.conditions?.forEach(async (condition) => {
            const addConditionBody: ConditionFormSchemaData = {
              node: data.source_node,
              edge: addEdgeRes.id,
              expr: condition.expr,
              value: condition.value,
            };

            const addConditionRes =
              await createConditionService(addConditionBody);

            console.log('Condition created successfully', addConditionRes);
          });
        }

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

  const addConditionGroup = useCallback(
    async (data: ConditionGroupFormSchemaData) => {
      const conditionGroupString = convertConditionGroupToConditionString(data);

      const createConditionGroupRes =
        await createConditionGroupService(conditionGroupString);

      console.log('create condition group res >>', createConditionGroupRes);
    },
    [],
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
              label: updates.label,
              caption: updates.label,
              fieldType: updates.field_type,
              nodeType: updates.type,
              validations: updates.validation_rules,
              color: generateRandomRgbColor(updates.type),
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
              //
              label: updates.label,
              from: updates.source_node,
              to: updates.target_node,
              sourceNode: updates.source_node,
              targetNode: updates.target_node,
              edgeType: updates.type,
              caption: updates.label,
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

    // Search text
    searchText,

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
    setSearchText,

    // Operations
    addNode,
    addEdge,
    addConditionGroup,
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
