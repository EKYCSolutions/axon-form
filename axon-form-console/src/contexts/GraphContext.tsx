import type { GraphSheetType } from '@/configs/graph';
import type { AddNodeFormSchemaData } from '@/validations/AddNodeValidation';
import type NVL from '@neo4j-nvl/base';
import type { Node, Relationship } from '@neo4j-nvl/base';
import type { MouseEventCallbacks } from '@neo4j-nvl/react';
import { createContext } from 'react';

export interface GraphContextType {
  // Refs
  nvlRef: React.MutableRefObject<NVL | null>;

  // State
  nodes: Node[];
  relationships: Relationship[];
  zoom: number;
  //
  sheetOpen: boolean;
  sheetType: GraphSheetType;

  // Actions
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[]>>;
  //
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSheetType: React.Dispatch<React.SetStateAction<GraphSheetType>>;
  //
  addNode: (data: AddNodeFormSchemaData) => void;
  addRelationship: (from: string, to: string, caption?: string) => void;
  removeNode: (nodeId: string) => void;
  removeRelationship: (relationshipId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  updateRelationship: (
    relationshipId: string,
    updates: Partial<Relationship>,
  ) => void;
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
