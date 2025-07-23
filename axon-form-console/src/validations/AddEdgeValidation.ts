import { EdgeType } from '@/configs/graph';
import z from 'zod';

export const AddEdgeFormSchema = z.object({
  source_node: z.string().min(1, {
    message: 'Source node must be selected',
  }),
  target_node: z.string().min(1, {
    message: 'Target node must be selected',
  }),
  edge_type: z.enum(EdgeType),
});

export type AddEdgeFormSchemaData = z.infer<typeof AddEdgeFormSchema>;

export const AddEdgeFormSchemaDefaultValue: AddEdgeFormSchemaData = {
  source_node: '',
  target_node: '',
  edge_type: EdgeType.HasOption,
};
