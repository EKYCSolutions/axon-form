import { EdgeType } from '@/configs/graph';
import z from 'zod';

export const EdgeFormSchema = z.object({
  source_node: z.string().min(1, {
    message: 'Source node must be selected',
  }),
  target_node: z.string().min(1, {
    message: 'Target node must be selected',
  }),
  edge_type: z.enum(EdgeType),
});

export type EdgeFormSchemaData = z.infer<typeof EdgeFormSchema>;

export const EdgeFormSchemaDefaultValue: EdgeFormSchemaData = {
  source_node: '',
  target_node: '',
  edge_type: EdgeType.HasOption,
};
