import type { EdgeType } from '@/configs/graph';
import { parseNodeCondition, type NodeCondition } from './Node';
import type { EdgeResponse } from './PocketBaseResponse';

export interface Edge {
  id: string;
  label: string;
  sourceNode: string;
  targetNode: string;
  edgeType: EdgeType;
  conditions: NodeCondition[];
}

export function parseEdgeResponse(edge: EdgeResponse): Edge {
  return {
    id: edge.id,
    label: edge.label,
    sourceNode: edge.source_node,
    targetNode: edge.target_node,
    edgeType: edge.type as EdgeType,
    conditions: edge.expand?.conditions_via_edge?.map(parseNodeCondition) ?? [],
  };
}
