import {
  EdgeType,
  GraphSheetType,
  NodeFieldType,
  NodeType,
} from '@/configs/graph';
import { GraphContext, type GraphContextType } from '@/contexts/GraphContext';
import type { GraphEdge, GraphNode } from '@/types/Graph.js';
import type { AddEdgeFormSchemaData } from '@/validations/AddEdgeValidation';
import type { AddNodeFormSchemaData } from '@/validations/AddNodeValidation';
import type { HitTargets, Node, NVL, Relationship } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { useRef, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GraphProviderProps {
  children: ReactNode;
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
}

export function GraphProvider({
  children,
  initialNodes = [
    {
      id: '0',
      label: 'graphs',
      caption: 'graphs',
      nodeType: NodeType.Input,
      fieldType: NodeFieldType.Button,
    },
    {
      id: '1',
      label: 'input',
      caption: 'input',
      nodeType: NodeType.Input,
      fieldType: NodeFieldType.Button,
    },
    {
      id: '2',
      label: 'option',
      caption: 'option',
      nodeType: NodeType.Option,
      fieldType: NodeFieldType.Button,
    },
    {
      id: '3',
      label: 'value',
      caption: 'value',
      nodeType: NodeType.Value,
      fieldType: NodeFieldType.Button,
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
      source_node: '1',
      target_node: '3',
      edgeType: EdgeType.HasOption,
    },
    {
      from: '2',
      to: '3',
      id: '11',
      caption: 'child',
      source_node: '1',
      target_node: '3',
      edgeType: EdgeType.HasOption,
    },
  ],
}: GraphProviderProps) {
  const nvlRef = useRef<NVL | null>(null);

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<GraphNode>();
  const [sourceNode, setSourceNode] = useState<GraphNode | undefined>();
  const [targetNode, setTargetNode] = useState<GraphNode | undefined>();
  //
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  //
  const [zoom, setZoom] = useState<number>(100);
  //
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<GraphSheetType>(
    GraphSheetType.AddNode,
  );
  const [isEdgeMode, setIsEdgeMode] = useState<boolean>(false);

  const mouseEventCallbacks: MouseEventCallbacks = {
    onNodeClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) => {
      console.log('onNodeClick', node, hitTargets, evt);
      //
      const foundNode = nodes.find((n) => n.id == node.id);
      setSelectedNode(foundNode);

      if (isEdgeMode) {
        if (!sourceNode) {
          console.log('in source node');
          setSourceNode(foundNode);
          return;
        }

        if (!targetNode) {
          console.log('in target node node');
          setTargetNode(foundNode);
          setSheetOpen(true);
          setIsEdgeMode(false);
        }

        return;
      }

      // Only open node detail sheet when in normal mode
      setSheetOpen(true);
      setSheetType(GraphSheetType.ShowNode);
    },
    onRelationshipClick: (
      rel: Relationship,
      hitTargets: HitTargets,
      evt: MouseEvent,
    ) => console.log('onRelationshipClick', rel, hitTargets, evt),
    onDrag: (nodes: Node[]) => console.log('onDrag', nodes),
    onPan: (_panning: { x: number; y: number }, evt: MouseEvent) =>
      console.log('onPan', _panning, evt),
    onZoom: (zoomLevel: number) => {
      console.log('onZoom', zoomLevel);
      const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
      setZoom(zoomLevelCleaned);
    },
  };

  const addNode = (data: AddNodeFormSchemaData) => {
    const newNode: GraphNode = {
      id: uuidv4(),
      caption: data.label,
      label: data.label,
      fieldType: data.field_type,
      nodeType: data.type,
    };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    nvlRef.current?.addElementsToGraph(newNodes, edges);
  };

  const addEdge = (data: AddEdgeFormSchemaData) => {
    const newEdge: GraphEdge = {
      id: uuidv4(),
      from: data.source_node,
      to: data.target_node,
      source_node: data.source_node,
      target_node: data.target_node,
      edgeType: EdgeType.HasOption,
      caption: data.edge_type || '',
    };
    const newEdges = [...edges, newEdge];
    setEdges(newEdges);

    nvlRef.current?.addElementsToGraph(nodes, newEdges);

    setSourceNode(undefined);
    setTargetNode(undefined);
  };

  const removeNode = (nodeId: string) => {
    const newNodes = nodes.filter((node) => node.id !== nodeId);
    const newEdges = edges.filter(
      (rel) => rel.from !== nodeId && rel.to !== nodeId,
    );
    setNodes(newNodes);
    setEdges(newEdges);
    nvlRef.current?.addElementsToGraph(newNodes, newEdges);
  };

  const removeEdge = (edgeId: string) => {
    const newEdges = edges.filter((rel) => rel.id !== edgeId);
    setEdges(newEdges);
    nvlRef.current?.addElementsToGraph(nodes, newEdges);
  };

  const updateNode = (nodeId: string, updates: Partial<GraphNode>) => {
    const newNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node,
    );
    setNodes(newNodes);
    nvlRef.current?.addElementsToGraph(newNodes, edges);
  };

  const updateEdge = (edgeId: string, updates: Partial<GraphEdge>) => {
    const newEdges = edges.map((rel) =>
      rel.id === edgeId ? { ...rel, ...updates } : rel,
    );
    setEdges(newEdges);
    nvlRef.current?.addElementsToGraph(nodes, newEdges);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    nvlRef.current?.addElementsToGraph([], []);
  };

  const resetZoom = () => {
    nvlRef.current?.resetZoom();
    //
    const zoomLevel = 0.75; // Default resetZoom value is 0.75
    const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
    setZoom(zoomLevelCleaned);
  };

  const updateZoom = (zoomLevel: number) => {
    nvlRef.current?.setZoom(zoomLevel);
    //
    const zoomLevelCleaned = Math.ceil(zoomLevel * 100);
    setZoom(zoomLevelCleaned);
  };

  const value: GraphContextType = {
    nvlRef,
    nodes,
    selectedNode,
    setSelectedNode,
    sourceNode,
    targetNode,
    zoom,
    edges,
    sheetOpen,
    sheetType,
    isEdgeMode,
    setSheetOpen,
    setSheetType,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
    setNodes,
    setEdges,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    updateNode,
    updateEdge,
    clearGraph,
    resetZoom,
    updateZoom,
    mouseEventCallbacks,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}
