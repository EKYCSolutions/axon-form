/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  EdgeType,
  GraphSheetType,
  NodeFieldType,
  NodeType,
} from '@/configs/graph';
import { GraphContext, type GraphContextType } from '@/contexts/GraphContext';
import {
  createConditionGroup as createConditionGroupService,
  createCondition as createConditionService,
  createEdge as createEdgeService,
  createNode as createNodeService,
  deleteCondition as deleteConditionService,
  deleteEdge as deleteEdgeService,
  deleteNode as deleteNodeService,
  getAllConditionGroups,
  getAllNodes,
  getAllPages,
  updateCondition as updateConditionService,
  updateEdge as updateEdgeService,
  updateNode as updateNodeService,
} from '@/services/PocketBaseService';
import type {
  EdgeConditionGroup,
  GraphEdge,
  GraphNode,
  Page,
} from '@/types/Graph.js';
import type {
  ConditionGroupResponse,
  NodeResponse,
  PageResponse,
} from '@/types/PocketBaseResponse';
import { generateRandomRgbColor } from '@/utils/Color';
import { convertConditionGroupToConditionString } from '@/utils/Graph';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import {
  convertConditionFormToGraphEdgeCondition,
  type ConditionFormSchemaData,
} from '@/validations/ConditionValidation';
import { type EdgeFormSchemaData } from '@/validations/EdgeValidation.js';
import {
  convertGraphNodeToNodeForm,
  convertNodeResponseToGraphNode,
  type NodeFormSchemaData,
} from '@/validations/NodeValidation.js';
import type { PageFormSchemaData } from '@/validations/PageValidation';
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
  initialConditionGroups?: EdgeConditionGroup[];
  initialPages?: Page[];
}

const DEFAULT_ZOOM_LEVEL = 0.75;

export function GraphProvider({
  children,
  initialNodes = [],
  initialEdges = [],
  initialConditionGroups = [],
  initialPages = [],
}: GraphProviderProps) {
  const nvlRef = useRef<NVL | null>(null);

  // Graph data state
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [conditionGroups, setConditionGroups] = useState<EdgeConditionGroup[]>(
    initialConditionGroups,
  );
  const [pages, setPages] = useState<Page[]>(initialPages);

  // UI state
  const [selectedNode, setSelectedNode] = useState<GraphNode | undefined>();
  const [selectedNodes, setSelectedNodes] = useState<GraphNode[]>([]);
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
  const [conditionGroupsQuery] = useQueries({
    queries: [
      {
        queryKey: ['conditionGroups'],
        queryFn: () => getAllConditionGroups(),
      },
    ],
  });
  const [pageQuery] = useQueries({
    queries: [
      {
        queryKey: ['pages'],
        queryFn: () => getAllPages(),
      },
    ],
  });

  useEffect(() => {
    if (nodesQuery.status === 'success' && nodesQuery.data) {
      console.log('Fetching nodes data from query');

      const nodeRes: GraphNode[] = nodesQuery.data?.map((node: NodeResponse) =>
        convertNodeResponseToGraphNode(node),
      );
      const nodeIds = nodeRes.map((node) => node.id);

      const edgeRes: GraphEdge[] = nodeRes
        .filter((node) => node.edges.length > 0)
        .flatMap((node) => node.edges);

      const ids = new Set();
      const uniqueEdges = edgeRes.filter(
        ({ id }) => !ids.has(id) && ids.add(id),
      );
      const edgesWithNodes = uniqueEdges.filter(
        (edge) => nodeIds.includes(edge.from) && nodeIds.includes(edge.to),
      );

      setNodes(nodeRes);
      setEdges(edgesWithNodes);
    }

    if (conditionGroupsQuery.status && conditionGroupsQuery.data) {
      const conditionGroupRes: EdgeConditionGroup[] =
        conditionGroupsQuery.data?.map((cd: ConditionGroupResponse) => {
          return {
            id: cd.id,
            node: cd.node,
            conditions: cd.conditions,
          };
        });

      setConditionGroups(conditionGroupRes);
    }

    if (pageQuery.status && pageQuery.data) {
      const pageRes: Page[] = pageQuery.data?.map((p: PageResponse) => {
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          field_ids: p.field_ids['ids'],
        };
      });

      setPages(pageRes);
    }
  }, [
    nodesQuery.status,
    nodesQuery.data,
    conditionGroupsQuery.status,
    conditionGroupsQuery.data,
  ]); // Only depend on query status and data

  // Helper function to update graph visualization
  const updateGraphVisualization = useCallback(
    (newNodes: GraphNode[], newEdges: GraphEdge[]) => {
      nvlRef.current?.addElementsToGraph(newNodes, newEdges);
    },
    [],
  );

  // Helper function to handle success
  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
    console.log('Graph operation success:', message);
  }, []);

  // Helper function to handle errors
  const handleError = useCallback((error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(errorMessage);
    console.error('Graph operation error:', error);
  }, []);

  // Edge creation helpers
  const resetEdgeMode = useCallback(() => {
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

        // For edit mode
        if (targetNode) {
          setIsEdgeMode(false);
          setSheetOpen(true);
        }

        return;
      }

      if (!targetNode) {
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
    onNodeRightClick: useCallback(
      (node, hitElements, event) => {
        // Update node selected state
        const updatedNodes = nodes.map((item) =>
          item.id === node.id ? { ...item, selected: !item.selected } : item,
        );
        setNodes(updatedNodes);

        // handle selected nodes state
        const newNodes = selectedNodes.find((item) => item.id == node.id)
          ? selectedNodes.filter((item) => item.id !== node.id)
          : [...selectedNodes, node];
        setSelectedNodes(newNodes);
      },
      [nodes, selectedNodes],
    ),

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

        //
        const foundEdge = edges.find((e) => e.id === rel.id);
        const sourceNode = nodes.find((n) => n.id === foundEdge?.sourceNode);
        const targetNode = nodes.find((n) => n.id === foundEdge?.targetNode);

        //
        setSelectedEdge(foundEdge);
        setSourceNode(sourceNode);
        setTargetNode(targetNode);

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
        edges: [],
        activated: true,
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
      let newEdge: GraphEdge = {
        id: uuidv4(),
        label: data.label,
        from: data.source_node,
        to: data.target_node,
        sourceNode: data.source_node,
        targetNode: data.target_node,
        edgeType: data.type as EdgeType,
        caption: data.label || '',
      };

      try {
        const addEdgeRes = await createEdgeService(data);
        console.log('Edge created successfully', addEdgeRes);

        newEdge = {
          ...newEdge,
          id: addEdgeRes.id,
        };

        if (data.type == EdgeType.Shows && data.conditions) {
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

          newEdge = {
            ...newEdge,
            conditions: data.conditions.map((condition) =>
              convertConditionFormToGraphEdgeCondition(condition),
            ),
          };
        }

        const newEdges = [...edges, newEdge];

        setEdges(newEdges);
        updateGraphVisualization(nodes, newEdges);
        resetEdgeMode();
      } catch (error) {
        handleError(error);
      }
    },
    [edges, nodes, updateGraphVisualization, handleError, resetEdgeMode],
  );

  const addConditionGroup = useCallback(
    async (data: ConditionGroupFormSchemaData) => {
      const conditionGroupString = convertConditionGroupToConditionString(data);

      try {
        const createConditionGroupRes = await createConditionGroupService(
          data,
          conditionGroupString,
        );

        console.log('create condition group res >>', createConditionGroupRes);
      } catch (error) {
        handleError(error);
      }
    },
    [],
  );

  const addPage = useCallback(
    async (data: PageFormSchemaData) => {
      try {
        // await createPageService(data);

        const pageNode: NodeFormSchemaData = {
          type: NodeType.Page,
          label: data.title ?? '',
          validation_rules: [],
          metadata: {
            title: data.title,
            description: data.description,
          },
        };

        const addNodeRes = await createNodeService(pageNode);

        let newNode: GraphNode = {
          id: addNodeRes.id,
          caption: addNodeRes.label,
          label: addNodeRes.label,
          fieldType: undefined,
          nodeType: NodeType.Page,
          color: generateRandomRgbColor(NodeType.Page),
          edges: [],
          activated: true,
        };

        newNode = {
          ...newNode,
          id: addNodeRes.id,
        };

        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        updateGraphVisualization(newNodes, edges);
        //
        data.field_ids.forEach(async (id) => {
          const data: EdgeFormSchemaData = {
            label: `${pageNode.label}-has-field`,
            source_node: addNodeRes.id,
            target_node: id,
            type: EdgeType.HasField,
          };
          await addEdge(data);
        });
      } catch (error) {
        handleError(error);
      }
    },
    [nodes, edges, updateGraphVisualization, handleError],
  );

  const removeNode = useCallback(
    async (nodeId: string) => {
      const newNodes = nodes.filter((node) => node.id !== nodeId);
      //
      const edgeIdsToDelete = edges
        .filter((edge) => edge.from === nodeId || edge.to === nodeId)
        .map((edge) => edge.id);
      const newEdges = edges.filter(
        (edge) => !edgeIdsToDelete.includes(edge.id),
      );
      //
      try {
        await Promise.all([
          deleteNodeService(nodeId),
          edgeIdsToDelete.map((id) => deleteEdgeService(id)),
        ]);

        setNodes(newNodes);
        setEdges(newEdges);
        updateGraphVisualization(newNodes, newEdges);

        setSheetOpen(false);

        handleSuccess('Node deleted successfully');
      } catch (error) {
        handleError(error);
      }
    },
    [nodes, edges, updateGraphVisualization],
  );

  const removeEdge = useCallback(
    (edgeId: string) => {
      try {
        deleteEdgeService(edgeId);
        //
        const newEdges = edges.filter((edge) => edge.id !== edgeId);
        setEdges(newEdges);
        updateGraphVisualization(nodes, newEdges);
        //
        setSheetOpen(false);
        //
        handleSuccess('Edge deleted successfully');
      } catch (error) {
        handleError(error);
      }
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
        console.log('Node updated successfully');
        handleSuccess('Node updated successfully');
      } catch (error) {
        handleError(error);
      }

      setNodes(newNodes);
      updateGraphVisualization(newNodes, edges);
    },
    [nodes, edges, updateGraphVisualization, handleError],
  );

  const updateEdge = useCallback(
    async (
      edgeId: string,
      updates: EdgeFormSchemaData,
      initialEdgeData: EdgeFormSchemaData,
    ) => {
      //
      if (updates.source_node == updates.target_node) {
        handleError(Error('Source and target nodes cannot be the same'));
        return;
      }

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

        if (updates.type == EdgeType.Shows && updates.conditions) {
          //
          const newConditions = updates.conditions.filter(
            (condition) => !condition.id,
          );
          //
          const updatedConditions = updates.conditions.filter(
            (condition) => condition.id,
          );
          //
          const updatedConditionIds = updatedConditions.map(
            (condition) => condition.id as string,
          );
          //
          const deletedConditionIds = initialEdgeData
            .conditions!.filter(
              (c) => c.id && !updatedConditionIds.includes(c.id),
            )
            .map((condition) => condition.id);

          newConditions.forEach(async (condition) => {
            console.log('new condition >>', condition);
            //
            const addConditionBody: ConditionFormSchemaData = {
              node: updates.source_node,
              edge: edgeId,
              expr: condition.expr,
              value: condition.value,
            };
            const addConditionRes =
              await createConditionService(addConditionBody);
            console.log('Condition created successfully', addConditionRes);
          });
          //
          updatedConditions.forEach(async (condition) => {
            console.log('updated condition >>', condition);
            //
            const updateConditionBody: ConditionFormSchemaData = {
              node: updates.source_node,
              edge: edgeId,
              expr: condition.expr,
              value: condition.value,
            };
            const updateConditionRes = await updateConditionService(
              condition.id as string,
              updateConditionBody,
            );
            console.log('Condition created successfully', updateConditionRes);
          });
          //
          deletedConditionIds.forEach(async (id) => {
            console.log('deleted condition >>', id);
            const deleteConditionRes = await deleteConditionService(
              id as string,
            );
            console.log('Condition deleted successfully', deleteConditionRes);
          });
        }

        console.log('Edge updated successfully');
        handleSuccess('Edge updated successfully');
      } catch (error) {
        handleError(error);
      }

      setEdges(newEdges);
      updateGraphVisualization(nodes, newEdges);
      resetEdgeMode();
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

  const resetSelectedNodes = () => {
    const updatedNodes = nodes.map((item) =>
      item.selected ? { ...item, selected: false } : item,
    );
    //
    setSelectedNodes([]);
    setNodes(updatedNodes);
  };

  const removeSelectedNodes = async () => {
    console.log('deleting selected nodes >>', selectedNodes);
    const nodeIdsToDelete = selectedNodes.map((node) => node.id);
    const edgeIdsToDelete: string[] = [];

    try {
      selectedNodes.forEach(async (node) => {
        const edgesOfNodeToDelete = edges
          .filter((edge) => edge.from === node.id || edge.to === node.id)
          .map((edge) => edge.id);

        await Promise.all([
          deleteNodeService(node.id),
          edgesOfNodeToDelete.map((id) => deleteEdgeService(id)),
        ]);

        edgeIdsToDelete.push(...edgesOfNodeToDelete);
      });

      const updatedNodes = nodes.filter(
        (node) => !nodeIdsToDelete.includes(node.id),
      );
      const updatedEdges = edges.filter(
        (edge) => !edgeIdsToDelete.includes(edge.id),
      );

      setSelectedNodes([]);
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      updateGraphVisualization(updatedNodes, updatedEdges);
    } catch (error) {
      handleError(error);
    }
  };

  const duplicateNode = async (nodeId: string) => {
    const node = nodes.find((node) => node.id == nodeId);

    if (!node) {
      handleError(Error('Node not found'));
      return;
    }

    const addNodeBody: NodeFormSchemaData = {
      ...convertGraphNodeToNodeForm(node),
      label: `${node.label} copy`,
    };

    addNode(addNodeBody);
  };

  const duplicateSelectedNodes = async () => {
    console.log('duplicating selected nodes >>', selectedNodes);

    const addNodesBody = selectedNodes.map((node) => {
      return {
        ...convertGraphNodeToNodeForm(node),
        label: `${node.label} copy`,
      };
    });

    try {
      const addNodesRes = await Promise.all(
        addNodesBody.map((node) => createNodeService(node)),
      );

      const newNodes: GraphNode[] = addNodesRes.map((node: NodeResponse) => {
        return {
          ...node,
          caption: node.label,
          nodeType: node.type as NodeType,
          fieldType: node.field_type as NodeFieldType,
          validations: [],
          activated: true,
          edges: [],
          color: generateRandomRgbColor(node.type as NodeType),
          validation_rules: [],
        };
      });

      setNodes([...nodes, ...newNodes]);
      setSelectedNodes([]);
      updateGraphVisualization([...nodes, ...newNodes], edges);
      //
      handleSuccess('Nodes duplicated successfully');
    } catch (error) {
      handleError(error);
    }

    //
    resetSelectedNodes();
  };

  // Context value
  const value: GraphContextType = {
    // Refs
    nvlRef,

    // Data
    nodes,
    edges,
    conditionGroups,
    pages,

    // Search text
    searchText,

    // UI state
    selectedNode,
    selectedNodes,
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
    setConditionGroups,
    setSearchText,

    // Operations
    addNode,
    duplicateNode,
    addEdge,
    addConditionGroup,
    addPage,
    removeNode,
    removeEdge,
    updateNode,
    updateEdge,
    clearGraph,
    resetZoom,
    updateZoom,
    resetEdgeMode,
    //
    resetSelectedNodes,
    removeSelectedNodes,
    duplicateSelectedNodes,

    // Event handlers
    mouseEventCallbacks,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}
