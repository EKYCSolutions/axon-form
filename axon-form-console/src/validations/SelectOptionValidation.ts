import z from 'zod';

export const SelectOptionFormSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, {
    message: 'Label must be at least 1 character',
  }),
  value: z.string().min(1, {
    message: 'Value must be at least 1 character',
  }),
});

export type SelectOptionFormSchemaData = z.infer<typeof SelectOptionFormSchema>;
