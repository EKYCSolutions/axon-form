import { NodeFieldType, NodeType } from '@/configs/graph';
import z from 'zod';

export const AddNodeFormSchema = z.object({
  type: z.enum(NodeType),
  field_type: z.enum(NodeFieldType),
  label: z.string().min(1, {
    message: 'Label must be at least 1 character',
  }),
});

export type AddNodeFormSchemaData = z.infer<typeof AddNodeFormSchema>;

export const AddNodeFormSchemaDefaultValue: AddNodeFormSchemaData = {
  type: NodeType.Input,
  field_type: NodeFieldType.Text,
  label: '',
};
