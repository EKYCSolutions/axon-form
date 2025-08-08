/* eslint-disable @typescript-eslint/no-unused-vars */
import { EdgeType, GraphSheetType } from '@/configs/graph';
import {
  createConditionGroup as createConditionGroupService,
  createCondition as createConditionService,
  createEdge as createEdgeService,
  createNode as createNodeService,
  getAllEdges,
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
import { type NodeFormSchemaData } from '@/validations/NodeValidation.js';
import type { HitTargets, Node, NVL, Relationship } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { useQueries } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface GraphDataContextType {
  nodes: GraphNode[];
  edges: GraphEdge[];
  searchText: string;
  nodesQuery: any;
  edgesQuery: any;
  setNodes: (nodes: GraphNode[]) => void;
  setEdges: (edges: GraphEdge[]) => void;
  setSearchText: (text: string) => void;
}

interface GraphUIContextType {
  selectedNode?: GraphNode;
  selectedEdge?: GraphEdge;
  zoom: number;
  sheetOpen: boolean;
  sheetType: GraphSheetType;
  setSelectedNode: (node: GraphNode | undefined) => void;
  setSelectedEdge: (edge: GraphEdge | undefined) => void;
  setSheetOpen: (open: boolean) => void;
  setSheetType: (type: GraphSheetType) => void;
  setZoom: (zoom: number) => void;
}

interface GraphEdgeCreationContextType {
  isEdgeMode: boolean;
  sourceNode?: GraphNode;
  targetNode?: GraphNode;
  setIsEdgeMode: (isEdgeMode: boolean) => void;
  setSourceNode: (node: GraphNode | undefined) => void;
  setTargetNode: (node: GraphNode | undefined) => void;
  resetEdgeCreation: () => void;
  handleEdgeModeNodeClick: (node: GraphNode | undefined) => void;
}

interface GraphVisualizationContextType {
  nvlRef: RefObject<NVL>;
  updateGraphVisualization: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  resetZoom: () => void;
  updateZoom: (zoomLevel: number) => void;
  mouseEventCallbacks: MouseEventCallbacks;
}

interface GraphOperationsContextType {
  addNode: (data: NodeFormSchemaData) => Promise<void>;
  addEdge: (data: EdgeFormSchemaData) => Promise<void>;
  addConditionGroup: (data: ConditionGroupFormSchemaData) => Promise<void>;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  updateNode: (nodeId: string, updates: NodeFormSchemaData) => Promise<void>;
  updateEdge: (edgeId: string, updates: EdgeFormSchemaData) => Promise<void>;
  clearGraph: () => void;
  fetchGraphData: () => void;
}

// =============================================================================
// CONTEXTS
// =============================================================================

const GraphDataContext = createContext<GraphDataContextType | undefined>(
  undefined,
);
const GraphUIContext = createContext<GraphUIContextType | undefined>(undefined);
const GraphEdgeCreationContext = createContext<
  GraphEdgeCreationContextType | undefined
>(undefined);
const GraphVisualizationContext = createContext<
  GraphVisualizationContextType | undefined
>(undefined);
const GraphOperationsContext = createContext<
  GraphOperationsContextType | undefined
>(undefined);

// =============================================================================
// HOOKS
// =============================================================================

export const useGraphData = () => {
  const context = useContext(GraphDataContext);
  if (!context) {
    throw new Error('useGraphData must be used within a GraphDataProvider');
  }
  return context;
};

export const useGraphUI = () => {
  const context = useContext(GraphUIContext);
  if (!context) {
    throw new Error('useGraphUI must be used within a GraphUIProvider');
  }
  return context;
};

export const useGraphEdgeCreation = () => {
  const context = useContext(GraphEdgeCreationContext);
  if (!context) {
    throw new Error(
      'useGraphEdgeCreation must be used within a GraphEdgeCreationProvider',
    );
  }
  return context;
};

export const useGraphVisualization = () => {
  const context = useContext(GraphVisualizationContext);
  if (!context) {
    throw new Error(
      'useGraphVisualization must be used within a GraphVisualizationProvider',
    );
  }
  return context;
};

export const useGraphOperations = () => {
  const context = useContext(GraphOperationsContext);
  if (!context) {
    throw new Error(
      'useGraphOperations must be used within a GraphOperationsProvider',
    );
  }
  return context;
};

// =============================================================================
// DATA PROVIDER
// =============================================================================

interface GraphDataProviderProps {
  children: ReactNode;
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
}

export function GraphDataProvider({
  children,
  initialNodes = [],
  initialEdges = [],
}: GraphDataProviderProps) {
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [searchText, setSearchText] = useState<string>('');

  const [nodesQuery, edgesQuery] = useQueries({
    queries: [
      {
        queryKey: ['nodes', searchText],
        queryFn: () => getAllNodes(searchText),
      },
      {
        queryKey: ['edges', searchText],
        queryFn: () => getAllEdges(),
      },
    ],
  });

  // Fetch data only when queries are successful and have new data
  useEffect(() => {
    if (nodesQuery.status === 'success' && nodesQuery.data?.items) {
      console.log('Fetching nodes data from query');

      const nodeRes: GraphNode[] = nodesQuery.data.items.map(
        (node: NodeResponse) => convertNodeFormSchemaToGraphNode(node),
      );

      const edgeRes: GraphEdge[] = nodeRes
        .filter((node) => node?.edges && node.edges.length > 0)
        .flatMap((node) => node.edges);

      const ids = new Set();
      const uniqueEdges = edgeRes.filter(
        ({ id }) => !ids.has(id) && ids.add(id),
      );

      setNodes(nodeRes);
      setEdges([]);
    }
  }, [nodesQuery.status, nodesQuery.data]);

  const value: GraphDataContextType = {
    nodes,
    edges,
    searchText,
    nodesQuery,
    edgesQuery,
    setNodes,
    setEdges,
    setSearchText,
  };

  return (
    <GraphDataContext.Provider value={value}>
      {children}
    </GraphDataContext.Provider>
  );
}

// =============================================================================
// UI PROVIDER
// =============================================================================

interface GraphUIProviderProps {
  children: ReactNode;
}

export function GraphUIProvider({ children }: GraphUIProviderProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | undefined>();
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | undefined>();
  const [zoom, setZoom] = useState<number>(100);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<GraphSheetType>(
    GraphSheetType.AddNode,
  );

  const value: GraphUIContextType = {
    selectedNode,
    selectedEdge,
    zoom,
    sheetOpen,
    sheetType,
    setSelectedNode,
    setSelectedEdge,
    setZoom,
    setSheetOpen,
    setSheetType,
  };

  return (
    <GraphUIContext.Provider value={value}>{children}</GraphUIContext.Provider>
  );
}

// =============================================================================
// EDGE CREATION PROVIDER
// =============================================================================

interface GraphEdgeCreationProviderProps {
  children: ReactNode;
}

export function GraphEdgeCreationProvider({
  children,
}: GraphEdgeCreationProviderProps) {
  const [isEdgeMode, setIsEdgeMode] = useState<boolean>(false);
  const [sourceNode, setSourceNode] = useState<GraphNode | undefined>();
  const [targetNode, setTargetNode] = useState<GraphNode | undefined>();

  const { setSheetOpen, setSheetType } = useGraphUI();

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
    [sourceNode, targetNode, setSheetOpen],
  );

  const value: GraphEdgeCreationContextType = {
    isEdgeMode,
    sourceNode,
    targetNode,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
    resetEdgeCreation,
    handleEdgeModeNodeClick,
  };

  return (
    <GraphEdgeCreationContext.Provider value={value}>
      {children}
    </GraphEdgeCreationContext.Provider>
  );
}

// =============================================================================
// VISUALIZATION PROVIDER
// =============================================================================

const DEFAULT_ZOOM_LEVEL = 0.75;

interface GraphVisualizationProviderProps {
  children: ReactNode;
}

export function GraphVisualizationProvider({
  children,
}: GraphVisualizationProviderProps) {
  const nvlRef = useRef<NVL | null>(null);

  const { nodes, edges } = useGraphData();
  const {
    setSelectedNode,
    setSelectedEdge,
    setSheetOpen,
    setSheetType,
    setZoom,
  } = useGraphUI();
  const { isEdgeMode, handleEdgeModeNodeClick } = useGraphEdgeCreation();

  const updateGraphVisualization = useCallback(
    (newNodes: GraphNode[], newEdges: GraphEdge[]) => {
      nvlRef.current?.addElementsToGraph(newNodes, newEdges);
    },
    [],
  );

  const resetZoom = useCallback(() => {
    nvlRef.current?.resetZoom();
    const zoomLevelCleaned = Math.ceil(DEFAULT_ZOOM_LEVEL * 100);
    setZoom(zoomLevelCleaned);
  }, [setZoom]);

  const updateZoom = useCallback(
    (zoomLevel: number) => {
      nvlRef.current?.setZoom(zoomLevel);
      const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
      setZoom(zoomLevelCleaned);
    },
    [setZoom],
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

        setSheetOpen(true);
        setSheetType(GraphSheetType.ShowNode);
      },
      [
        nodes,
        isEdgeMode,
        handleEdgeModeNodeClick,
        setSelectedNode,
        setSheetOpen,
        setSheetType,
      ],
    ),

    onRelationshipClick: useCallback(
      (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) => {
        console.log('onRelationshipClick', rel, hitTargets, evt);

        const foundEdge = edges.find((e) => e.id === rel.id);
        setSelectedEdge(foundEdge);

        setSheetOpen(true);
        setSheetType(GraphSheetType.ShowEdge);
      },
      [edges, setSelectedEdge, setSheetOpen, setSheetType],
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

    onZoom: useCallback(
      (zoomLevel: number) => {
        console.log('onZoom', zoomLevel);
        const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
        setZoom(zoomLevelCleaned);
      },
      [setZoom],
    ),
  };

  const value: GraphVisualizationContextType = {
    nvlRef,
    updateGraphVisualization,
    resetZoom,
    updateZoom,
    mouseEventCallbacks,
  };

  return (
    <GraphVisualizationContext.Provider value={value}>
      {children}
    </GraphVisualizationContext.Provider>
  );
}

// =============================================================================
// OPERATIONS PROVIDER
// =============================================================================

interface GraphOperationsProviderProps {
  children: ReactNode;
}

export function GraphOperationsProvider({
  children,
}: GraphOperationsProviderProps) {
  const { nodes, edges, setNodes, setEdges } = useGraphData();
  const { updateGraphVisualization } = useGraphVisualization();
  const { resetEdgeCreation } = useGraphEdgeCreation();

  // Helper function to handle errors
  const handleError = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(errorMessage);
    console.error('Graph operation error:', error);
  }, []);

  const fetchGraphData = useCallback(() => {
    console.log(
      'Manual fetch triggered - data will be fetched via useEffect in GraphDataProvider',
    );
  }, []);

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
    [nodes, edges, updateGraphVisualization, handleError, setNodes],
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
    [
      edges,
      nodes,
      updateGraphVisualization,
      handleError,
      resetEdgeCreation,
      setEdges,
    ],
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
    [nodes, edges, updateGraphVisualization, setNodes, setEdges],
  );

  const removeEdge = useCallback(
    (edgeId: string) => {
      const newEdges = edges.filter((edge) => edge.id !== edgeId);
      setEdges(newEdges);
      updateGraphVisualization(nodes, newEdges);
    },
    [edges, nodes, updateGraphVisualization, setEdges],
  );

  const updateNode = useCallback(
    async (nodeId: string, updates: NodeFormSchemaData) => {
      const newNodes = nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              ...updates,
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
        console.log('Node updated successfully');
      } catch (error) {
        handleError(error);
      }

      setNodes(newNodes);
      updateGraphVisualization(newNodes, edges);
    },
    [nodes, edges, updateGraphVisualization, handleError, setNodes],
  );

  const updateEdge = useCallback(
    async (edgeId: string, updates: EdgeFormSchemaData) => {
      const newEdges = edges.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
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
    [edges, nodes, updateGraphVisualization, handleError, setEdges],
  );

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    updateGraphVisualization([], []);
  }, [updateGraphVisualization, setNodes, setEdges]);

  const value: GraphOperationsContextType = {
    addNode,
    addEdge,
    addConditionGroup,
    removeNode,
    removeEdge,
    updateNode,
    updateEdge,
    clearGraph,
    fetchGraphData,
  };

  return (
    <GraphOperationsContext.Provider value={value}>
      {children}
    </GraphOperationsContext.Provider>
  );
}

// =============================================================================
// COMBINED PROVIDER
// =============================================================================

interface CombinedGraphProviderProps {
  children: ReactNode;
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
}

export function CombinedGraphProvider({
  children,
  initialNodes = [],
  initialEdges = [],
}: CombinedGraphProviderProps) {
  return (
    <GraphDataProvider initialNodes={initialNodes} initialEdges={initialEdges}>
      <GraphUIProvider>
        <GraphEdgeCreationProvider>
          <GraphVisualizationProvider>
            <GraphOperationsProvider>{children}</GraphOperationsProvider>
          </GraphVisualizationProvider>
        </GraphEdgeCreationProvider>
      </GraphUIProvider>
    </GraphDataProvider>
  );
}
