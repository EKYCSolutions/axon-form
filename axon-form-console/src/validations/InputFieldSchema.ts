import { NodeFieldType } from '@/configs/graph';
import z from 'zod';

// Base field properties that all field types share
export const BaseFieldSchema = z.object({
  id: z.string().min(1, 'Field ID is required'),
  fieldName: z
    .string()
    .min(1, 'Field name is required')
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Field name must be a valid identifier'),
  fieldLabel: z.string().min(1, 'Field label is required'),
  required: z.boolean().optional(),
  description: z.string().optional(),
});

// Schema for select/radio/checkbox options
export const OptionSchema = z.object({
  label: z.string().min(1, 'Option label is required'),
  value: z.string().min(1, 'Option value is required'),
});

// Text field schema
export const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Text),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(1).optional(),
  pattern: z.string().optional(), // regex pattern
}).refine(
  (data) =>
    !data.minLength || !data.maxLength || data.minLength <= data.maxLength,
  {
    message: 'Min length must be less than or equal to max length',
    path: ['maxLength'],
  },
);

// Number field schema
export const NumberFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Number),
  defaultValue: z.number().optional(),
  placeholder: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
}).refine((data) => !data.min || !data.max || data.min <= data.max, {
  message: 'Min value must be less than or equal to max value',
  path: ['max'],
});

// Email field schema
export const EmailFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Text),
  defaultValue: z.string().email().optional().or(z.literal('')),
  placeholder: z.string().optional(),
});

// Select field schema
export const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Select),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  multiple: z.boolean(),
  options: z
    .array(OptionSchema)
    .min(1, 'At least one option is required')
    .refine(
      (options) => {
        const values = options.map((opt) => opt.value);
        return new Set(values).size === values.length;
      },
      {
        message: 'Option values must be unique',
        path: ['options'],
      },
    ),
});

// Radio field schema
export const RadioFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Radio),
  defaultValue: z.string().optional(),
  options: z
    .array(OptionSchema)
    .min(2, 'Radio buttons need at least 2 options')
    .refine(
      (options) => {
        const values = options.map((opt) => opt.value);
        return new Set(values).size === values.length;
      },
      {
        message: 'Option values must be unique',
        path: ['options'],
      },
    ),
});

// Checkbox field schema
export const CheckboxFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Checkbox),
  defaultValue: z.array(z.string()),
  options: z
    .array(OptionSchema)
    .min(1, 'At least one checkbox option is required')
    .refine(
      (options) => {
        const values = options.map((opt) => opt.value);
        return new Set(values).size === values.length;
      },
      {
        message: 'Option values must be unique',
        path: ['options'],
      },
    ),
});

// Textarea field schema
export const TextareaFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.TextArea),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  rows: z.number().min(1).max(20),
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(1).optional(),
}).refine(
  (data) =>
    !data.minLength || !data.maxLength || data.minLength <= data.maxLength,
  {
    message: 'Min length must be less than or equal to max length',
    path: ['maxLength'],
  },
);

// Date field schema
export const DateFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.Date),
  defaultValue: z.string().optional(),
  min: z.string().optional(), // ISO date string
  max: z.string().optional(), // ISO date string
});

// File upload field schema
export const FileFieldSchema = BaseFieldSchema.extend({
  type: z.literal(NodeFieldType.File),
  acceptedFileTypes: z.array(z.string()),
  maxFileSize: z.number().positive().optional(), // in bytes
  multiple: z.boolean(),
});
