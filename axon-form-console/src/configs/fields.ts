import { NodeFieldType } from './graph';

export interface SelectItem {
  label: string;
  value: string;
}

interface InputFieldTypeSelectItem extends SelectItem {
  type: NodeFieldType;
}

export const inputFieldTypes: InputFieldTypeSelectItem[] = [
  {
    label: 'Text',
    value: 'text',
    type: NodeFieldType.Text,
  },
  {
    label: 'Number',
    value: 'number',
    type: NodeFieldType.Number,
  },
  {
    label: 'Datetime',
    value: 'datetime',
    type: NodeFieldType.Datetime,
  },
  {
    label: 'Multi Select',
    value: 'multi_select',
    type: NodeFieldType.MultiSelect,
  },
  {
    label: 'Radio',
    value: 'radio',
    type: NodeFieldType.Radio,
  },
  {
    label: 'Dropdown',
    value: 'dropdown',
    type: NodeFieldType.Dropdown,
  },
  {
    label: 'Checkbox',
    value: 'checkbox',
    type: NodeFieldType.Checkbox,
  },
  {
    label: 'File',
    value: 'file',
    type: NodeFieldType.File,
  },
  {
    label: 'Password',
    value: 'password',
    type: NodeFieldType.Password,
  },
];
