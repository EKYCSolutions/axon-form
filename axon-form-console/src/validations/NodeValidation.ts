import { ConditionExpression, NodeFieldType, NodeType } from '@/configs/graph';
import type { GraphNode } from '@/types/Graph';
import type { Node } from '@/types/Node';
import type { NodeResponse } from '@/types/PocketBaseResponse';
import { generateRandomRgbColor } from '@/utils/Color';
import z from 'zod';
import { ConditionFormSchema } from './ConditionValidation';
import { convertEdgeResponseToGraphEdge } from './EdgeValidation';
import { SelectOptionFormSchema } from './SelectOptionValidation';
import {
  convertValidationRuleResponseToValidationRule,
  ValidationRuleFormSchema,
} from './ValidationRulesValidation';

export const NodeFormSchema = z.object({
  id: z.string().optional(),
  type: z.enum(NodeType),
  field_type: z.enum(NodeFieldType).optional(),
  field_name: z.string().optional(),
  default_value: z.string().optional(),
  placeholder: z.string().optional(),
  label: z.string().min(1),
  select_options: z.array(SelectOptionFormSchema).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  order: z.number().optional(),
  validation_rules: z.array(ValidationRuleFormSchema).optional(),
  conditions: z.array(ConditionFormSchema).optional(),
});

export type NodeFormSchemaData = z.infer<typeof NodeFormSchema>;

export function convertNodeToNodeForm(node: Node): NodeFormSchemaData {
  return {
    id: node.id,
    type: node.type as NodeType,
    label: node.label || '',
    order: node.order,
    field_type: node.field_type as NodeFieldType,
    field_name: node.field_name,
    select_options: node.options?.map((option) => ({
      id: option.id,
      label: option.label,
      value: option.value,
    })),
    validation_rules: node.validation_rules?.map((rule) =>
      convertValidationRuleResponseToValidationRule(rule),
    ),
    conditions: node.conditions?.map((cond) => ({
      id: cond.id,
      check_node_id: cond.check_node,
      edge: cond.edge,
      expr: cond.expression as ConditionExpression,
      value: cond.expected_value.toString(),
    })),
  };
}

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

  console.log('edges >>', node.expand);
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
      node.validation_rules && node.validation_rules.length > 0
        ? node.validation_rules.map((validation) =>
            convertValidationRuleResponseToValidationRule(validation),
          )
        : [],
    edges: edges,
  };
}
