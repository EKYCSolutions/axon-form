import type { GraphSheetType } from '@/configs/graph';
import type { GraphEdge, GraphNode } from '@/types/Graph.js';
import type { AddEdgeFormSchemaData } from '@/validations/AddEdgeValidation';
import type { AddNodeFormSchemaData } from '@/validations/AddNodeValidation';
import type NVL from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { createContext, type RefObject } from 'react';

export interface GraphContextType {
  // Refs
  nvlRef: RefObject<NVL | null>;

  // State
  nodes: GraphNode[];
  selectedNode: GraphNode;
  sourceNode: GraphNode | undefined;
  targetNode: GraphNode | undefined;
  edges: GraphEdge[];
  zoom: number;
  //
  sheetOpen: boolean;
  sheetType: GraphSheetType;
  isEdgeMode: boolean;

  // Actions
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<GraphNode>>;
  setEdges: React.Dispatch<React.SetStateAction<GraphEdge[]>>;
  //
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSheetType: React.Dispatch<React.SetStateAction<GraphSheetType>>;
  //
  setIsEdgeMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSourceNode: React.Dispatch<React.SetStateAction<GraphNode | undefined>>;
  setTargetNode: React.Dispatch<React.SetStateAction<GraphNode | undefined>>;
  //
  addNode: (data: AddNodeFormSchemaData) => void;
  updateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  removeNode: (nodeId: string) => void;
  //
  addEdge: (data: AddEdgeFormSchemaData) => void;
  updateEdge: (edgeId: string, updates: Partial<GraphEdge>) => void;
  removeEdge: (edgeId: string) => void;
  //
  clearGraph: () => void;
  //
  resetZoom: () => void;
  updateZoom: (zoomLevel: number) => void;
  //
  resetEdgeMode: () => void;
  // Mouse event callbacks
  mouseEventCallbacks: MouseEventCallbacks;
}

export const GraphContext = createContext<GraphContextType | undefined>(
  undefined,
);
