import { EdgeType } from '@/configs/graph';
import type { Page } from '@/types/Page';
import { z } from 'zod';
import { convertNodeToNodeForm, NodeFormSchema } from './NodeValidation';

// Main form schema
export const PageFormSchema = z.object({
  form: z.string(),
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
  order: z.number().optional(),
  fields: z.array(NodeFormSchema).min(1, 'At least one field is required'),
});

export type PageFormSchemaData = z.infer<typeof PageFormSchema>;

export function convertPageToPageFormSchema(page: Page): PageFormSchemaData {
  const nodeById = new Map(page.fields.map((node) => [node.id, node]));
  const parentFieldIdByNodeId = new Map<string, string>();

  page.fields.forEach((node) => {
    if (!node.id) return;
    const filterByEdge = node.edges?.find(
      (edge) =>
        edge.edgeType === EdgeType.FilterBy && edge.sourceNode === node.id,
    );

    if (!filterByEdge) return;
    const parentNode = nodeById.get(filterByEdge.targetNode);
    if (parentNode?.id) {
      parentFieldIdByNodeId.set(node.id, parentNode.id);
    }
  });

  return {
    form: page.form,
    title: page.title,
    description: page.description,
    fields: page.fields
      .map((node) => {
        const nodeForm = convertNodeToNodeForm(node);
        if (node.id && parentFieldIdByNodeId.has(node.id)) {
          nodeForm.config = {
            ...(nodeForm.config ?? {}),
            parent_field_id: parentFieldIdByNodeId.get(node.id),
          };
        }
        return nodeForm;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };
}

export function convertPageToPageForm(page: Page) {
  return {
    id: page.id,
    order: page.order,
    title: page.title,
    description: page.description,
    field_ids: page.fields
      .sort((a, b) => a.order! - b.order!)
      .map((field) => field.id),
  };
}
