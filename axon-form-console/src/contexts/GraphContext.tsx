import type { GraphSheetType } from '@/configs/graph';
import type { GraphEdge, GraphNode } from '@/types/Graph.js';
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
  edges: GraphEdge[];
  zoom: number;
  //
  sheetOpen: boolean;
  sheetType: GraphSheetType;

  // Actions
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<GraphNode>>;
  setEdges: React.Dispatch<React.SetStateAction<GraphEdge[]>>;
  //
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSheetType: React.Dispatch<React.SetStateAction<GraphSheetType>>;
  //
  addNode: (data: AddNodeFormSchemaData) => void;
  updateNode: (nodeId: string, updates: Partial<GraphNode>) => void;
  removeNode: (nodeId: string) => void;
  //
  addEdge: (from: string, to: string, caption?: string) => void;
  updateEdge: (edgeId: string, updates: Partial<GraphEdge>) => void;
  removeEdge: (edgeId: string) => void;
  //
  clearGraph: () => void;
  //
  resetZoom: () => void;
  updateZoom: (zoomLevel: number) => void;

  // Mouse event callbacks
  mouseEventCallbacks: MouseEventCallbacks;
}

export const GraphContext = createContext<GraphContextType | undefined>(
  undefined,
);
