import type { Node, NVL, NvlOptions, Relationship } from '@neo4j-nvl/base';
import {
  InteractiveNvlWrapper,
  type MouseEventCallbacks,
} from '@neo4j-nvl/react';

export interface IProps {
  className?: string;
  nvlRef: React.RefObject<NVL | null>;
  options: NvlOptions;
  nodes: Node[];
  relationships: Relationship[];
  mouseEventCallbacks: MouseEventCallbacks;
}

export default function GraphVisualizationWrapper({
  className,
  nvlRef,
  options,
  nodes,
  relationships,
  mouseEventCallbacks,
}: IProps) {
  return (
    <InteractiveNvlWrapper
      ref={nvlRef}
      className={className}
      nvlOptions={options}
      nodes={nodes}
      rels={relationships}
      mouseEventCallbacks={mouseEventCallbacks}
    />
  );
}
