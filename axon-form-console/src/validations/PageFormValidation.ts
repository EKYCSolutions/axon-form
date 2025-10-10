import type { Page } from '@/types/Page';
import { z } from 'zod';
import { convertNodeToNodeForm, NodeFormSchema } from './NodeValidation';

// Main form schema
export const PageFormSchema = z.object({
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
  fields: z.array(NodeFormSchema).min(1, 'At least one field is required'),
});

export type PageFormSchemaData = z.infer<typeof PageFormSchema>;

export function convertPageToPageFormSchema(page: Page): PageFormSchemaData {
  return {
    title: page.title,
    description: page.description,
    fields: page.fields.map((node) => convertNodeToNodeForm(node)),
  };
}

export function convertPageToPageForm(page: Page) {
  return {
    id: page.id,
    title: page.title,
    description: page.description,
    field_ids: page.fields.map((field) => field.id),
  };
}
