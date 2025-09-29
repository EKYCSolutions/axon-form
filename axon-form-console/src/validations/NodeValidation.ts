import { NodeFieldType, NodeType } from '@/configs/graph';
import type { GraphNode } from '@/types/Graph';
import type { NodeResponse } from '@/types/PocketBaseResponse';
import { generateRandomRgbColor } from '@/utils/Color';
import z from 'zod';
import { convertEdgeResponseToGraphEdge } from './EdgeValidation';
import {
  convertValidationRuleResponseToValidationRule,
  ValidationRuleFormSchema,
} from './ValidationRulesValidation';

export const NodeFormSchema = z
  .object({
    type: z.enum(NodeType),
    field_type: z.enum(NodeFieldType).optional(),
    field_name: z.string().optional(),
    label: z.string().min(1, {
      message: 'Label must be at least 1 character',
    }),
    validation_rules: z.array(ValidationRuleFormSchema).optional(),
    metadata: z.record(z.string(), z.any()).optional(),
  })
  .refine(
    (data) => {
      if (data.type == NodeType.Input) {
        return data.field_type !== undefined && data.field_name !== undefined;
      }
      return true;
    },
    {
      message: 'Please select a field type',
      path: ['field_type'],
    },
  );

export type NodeFormSchemaData = z.infer<typeof NodeFormSchema>;

export const NodeFormSchemaDefaultValue: NodeFormSchemaData = {
  type: NodeType.Input,
  field_type: undefined,
  label: '',
  validation_rules: [],
};

export function convertGraphNodeToNodeForm(node: GraphNode) {
  return {
    id: node.id,
    type: node.nodeType,
    field_type: node.fieldType,
    field_name: node.fieldName,
    label: node.label,
    validation_rules: node.validations,
  };
}

export function convertNodeResponseToGraphNode(node: NodeResponse): GraphNode {
  //
  // Fetch all edges connected to the nodes
  // Each node could be a source or a target node
  // All the connected edges are destructured into expandedEdges
  const edges = [
    ...(node.expand?.edges_via_source_node
      ? node.expand.edges_via_source_node.map((edge) =>
          convertEdgeResponseToGraphEdge(edge),
        )
      : []),
    ...(node.expand?.edges_via_target_node
      ? node.expand.edges_via_target_node.map((edge) =>
          convertEdgeResponseToGraphEdge(edge),
        )
      : []),
  ];

  return {
    id: node.id,
    nodeType: node.type as NodeType,
    fieldType:
      node.field_type.length > 0
        ? (node.field_type as NodeFieldType)
        : undefined,
    fieldName: node.field_name,
    label: node.label,
    selected: false,
    caption: node.label,
    color: generateRandomRgbColor(node.type as NodeType),
    validations:
      node.validation_rules.length > 0
        ? node.validation_rules.map((validation) =>
            convertValidationRuleResponseToValidationRule(validation),
          )
        : [],
    edges: edges,
  };
}
