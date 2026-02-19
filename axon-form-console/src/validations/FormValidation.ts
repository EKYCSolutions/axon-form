import { z } from 'zod';

// Main form schema
export const FormSchema = z.object({
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
});

export type FormSchemaData = z.infer<typeof FormSchema>;
