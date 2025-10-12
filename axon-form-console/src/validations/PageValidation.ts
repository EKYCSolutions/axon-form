import z from 'zod';

export const OldPageFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  field_ids: z.array(z.string()).min(1, {
    message: 'Array must contain at least one element.',
  }),
});

export type OldPageFormSchemaData = z.infer<typeof OldPageFormSchema>;

export const OldPageFormSchemaDefaultValue: OldPageFormSchemaData = {
  field_ids: [],
};
