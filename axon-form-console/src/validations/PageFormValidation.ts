import { z } from 'zod';
import {
  CheckboxFieldSchema,
  DateFieldSchema,
  EmailFieldSchema,
  FileFieldSchema,
  NumberFieldSchema,
  RadioFieldSchema,
  SelectFieldSchema,
  TextareaFieldSchema,
  TextFieldSchema,
} from './InputFieldSchema';
import { NodeFormSchema } from './NodeValidation';

// Discriminated union of all field types
export const FieldSchema = z.discriminatedUnion('type', [
  TextFieldSchema,
  NumberFieldSchema,
  EmailFieldSchema,
  SelectFieldSchema,
  RadioFieldSchema,
  CheckboxFieldSchema,
  TextareaFieldSchema,
  DateFieldSchema,
  FileFieldSchema,
]);

// Main form schema
export const PageFormSchema = z.object({
  title: z.string().min(1, 'Form title is required'),
  description: z.string().optional(),
  fields: z.array(NodeFormSchema).min(1, 'At least one field is required'),
});

// Type inference
export type FieldData = z.infer<typeof FieldSchema>;
export type TextFieldData = z.infer<typeof TextFieldSchema>;
export type SelectFieldData = z.infer<typeof SelectFieldSchema>;
export type RadioFieldData = z.infer<typeof RadioFieldSchema>;
export type CheckboxFieldData = z.infer<typeof CheckboxFieldSchema>;
export type PageFormSchemaData = z.infer<typeof PageFormSchema>;

// Helper function to validate a single field based on its type
export const validateField = (fieldData: unknown) => {
  return FieldSchema.safeParse(fieldData);
};

// Helper function to validate the entire form
export const validateForm = (formData: unknown) => {
  return PageFormSchema.safeParse(formData);
};
