import type { GraphEdge, GraphNode } from '@/types/Graph';
import type { NVL, NvlOptions } from '@neo4j-nvl/base';
import {
  InteractiveNvlWrapper,
  type MouseEventCallbacks,
} from '@neo4j-nvl/react';

export interface IProps {
  className?: string;
  nvlRef: React.RefObject<NVL | null>;
  options: NvlOptions;
  nodes: GraphNode[];
  edges: GraphEdge[];
  mouseEventCallbacks: MouseEventCallbacks;
}

export default function GraphVisualizationWrapper({
  className,
  nvlRef,
  options,
  nodes,
  edges,
  mouseEventCallbacks,
}: IProps) {
  return (
    <InteractiveNvlWrapper
      ref={nvlRef}
      className={className}
      nvlOptions={options}
      nodes={nodes}
      rels={edges}
      mouseEventCallbacks={mouseEventCallbacks}
    />
  );
}
