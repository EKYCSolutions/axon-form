import type { EdgeType } from '@/configs/graph';

export interface Edge {
  label: string;
  sourceNode: string;
  targetNode: string;
  edgeType: EdgeType;
}
