import type { GraphSheetType } from '@/configs/graph';
import type { GraphEdge, GraphNode } from '@/types/Graph.js';
import type { ConditionGroupFormSchemaData } from '@/validations/ConditionGroupValidation';
import type { EdgeFormSchemaData } from '@/validations/EdgeValidation.js';
import type { NodeFormSchemaData } from '@/validations/NodeValidation.js';
import type NVL from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { createContext, type RefObject } from 'react';

export interface GraphContextType {
  // Refs
  nvlRef: RefObject<NVL | null>;

  // State
  nodes: GraphNode[];
  selectedNode: GraphNode | undefined;
  sourceNode: GraphNode | undefined;
  targetNode: GraphNode | undefined;
  edges: GraphEdge[];
  selectedEdge: GraphEdge | undefined;
  zoom: number;
  //
  sheetOpen: boolean;
  sheetType: GraphSheetType;
  isEdgeMode: boolean;
  //
  searchText: string;

  // Actions
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<GraphEdge[]>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<GraphNode | undefined>>;
  setSelectedEdge: React.Dispatch<React.SetStateAction<GraphEdge | undefined>>;
  //
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSheetType: React.Dispatch<React.SetStateAction<GraphSheetType>>;
  //
  setIsEdgeMode: React.Dispatch<React.SetStateAction<boolean>>;
  setSourceNode: React.Dispatch<React.SetStateAction<GraphNode | undefined>>;
  setTargetNode: React.Dispatch<React.SetStateAction<GraphNode | undefined>>;
  //
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  //
  addNode: (data: NodeFormSchemaData) => void;
  updateNode: (nodeId: string, updates: NodeFormSchemaData) => void;
  removeNode: (nodeId: string) => void;
  //
  addEdge: (data: EdgeFormSchemaData) => void;
  updateEdge: (edgeId: string, updates: EdgeFormSchemaData) => void;
  removeEdge: (edgeId: string) => void;
  //
  addConditionGroup: (data: ConditionGroupFormSchemaData) => void;
  //
  clearGraph: () => void;
  //
  resetZoom: () => void;
  updateZoom: (zoomLevel: number) => void;
  //
  mouseEventCallbacks: MouseEventCallbacks;
}

export const GraphContext = createContext<GraphContextType | undefined>(
  undefined,
);
