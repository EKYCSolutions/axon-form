import { GraphSheetType } from '@/configs/graph';
import { GraphContext, type GraphContextType } from '@/contexts/GraphContext';
import type { AddNodeFormSchemaData } from '@/validations/AddNodeValidation';
import type { HitTargets, Node, NVL, Relationship } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { useRef, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GraphProviderProps {
  children: ReactNode;
  initialNodes?: Node[];
  initialRelationships?: Relationship[];
}

export function GraphProvider({
  children,
  initialNodes = [
    { id: '0', caption: 'graphs' },
    { id: '1', caption: 'everywhere' },
    { id: '2', caption: 'everywhere' },
    { id: '3', caption: 'everywhere' },
    { id: '4', caption: 'everywhere' },
    { id: '5', caption: 'everywhere' },
  ],
  initialRelationships = [
    { from: '0', to: '1', id: '10', caption: 'are' },
    { from: '2', to: '3', id: '11', caption: 'child' },
  ],
}: GraphProviderProps) {
  const nvlRef = useRef<NVL | null>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [relationships, setRelationships] =
    useState<Relationship[]>(initialRelationships);
  const [zoom, setZoom] = useState<number>(100);
  //
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<GraphSheetType>(
    GraphSheetType.AddNode,
  );

  const mouseEventCallbacks: MouseEventCallbacks = {
    onRelationshipRightClick: (
      rel: Relationship,
      hitTargets: HitTargets,
      evt: MouseEvent,
    ) => console.log('onRelationshipRightClick', rel, hitTargets, evt),
    onNodeClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) => {
      (console.log('onNodeClick', node, hitTargets, evt), setSheetOpen(true));
      setSheetType(GraphSheetType.ShowNode);
    },
    onNodeRightClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeRightClick', node, hitTargets, evt),
    onNodeDoubleClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeDoubleClick', node, hitTargets, evt),
    onRelationshipClick: (
      rel: Relationship,
      hitTargets: HitTargets,
      evt: MouseEvent,
    ) => console.log('onRelationshipClick', rel, hitTargets, evt),
    onRelationshipDoubleClick: (
      rel: Relationship,
      hitTargets: HitTargets,
      evt: MouseEvent,
    ) => console.log('onRelationshipDoubleClick', rel, hitTargets, evt),
    onCanvasClick: (evt: MouseEvent) => console.log('onCanvasClick', evt),
    onCanvasDoubleClick: (evt: MouseEvent) =>
      console.log('onCanvasDoubleClick', evt),
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
    const newNode: Node = { id: uuidv4(), caption: data.label };
    const newNodes = [...nodes, newNode];
    setNodes(newNodes);
    nvlRef.current?.addElementsToGraph(newNodes, relationships);
  };

  const addRelationship = (from: string, to: string, caption?: string) => {
    const newRelationship: Relationship = {
      id: uuidv4(),
      from,
      to,
      caption: caption || '',
    };
    const newRelationships = [...relationships, newRelationship];
    setRelationships(newRelationships);
    nvlRef.current?.addElementsToGraph(nodes, newRelationships);
  };

  const removeNode = (nodeId: string) => {
    const newNodes = nodes.filter((node) => node.id !== nodeId);
    const newRelationships = relationships.filter(
      (rel) => rel.from !== nodeId && rel.to !== nodeId,
    );
    setNodes(newNodes);
    setRelationships(newRelationships);
    nvlRef.current?.addElementsToGraph(newNodes, newRelationships);
  };

  const removeRelationship = (relationshipId: string) => {
    const newRelationships = relationships.filter(
      (rel) => rel.id !== relationshipId,
    );
    setRelationships(newRelationships);
    nvlRef.current?.addElementsToGraph(nodes, newRelationships);
  };

  const updateNode = (nodeId: string, updates: Partial<Node>) => {
    const newNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node,
    );
    setNodes(newNodes);
    nvlRef.current?.addElementsToGraph(newNodes, relationships);
  };

  const updateRelationship = (
    relationshipId: string,
    updates: Partial<Relationship>,
  ) => {
    const newRelationships = relationships.map((rel) =>
      rel.id === relationshipId ? { ...rel, ...updates } : rel,
    );
    setRelationships(newRelationships);
    nvlRef.current?.addElementsToGraph(nodes, newRelationships);
  };

  const clearGraph = () => {
    setNodes([]);
    setRelationships([]);
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
    zoom,
    relationships,
    sheetOpen,
    sheetType,
    setSheetOpen,
    setSheetType,
    setNodes,
    setRelationships,
    addNode,
    addRelationship,
    removeNode,
    removeRelationship,
    updateNode,
    updateRelationship,
    clearGraph,
    resetZoom,
    updateZoom,
    mouseEventCallbacks,
  };

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}
