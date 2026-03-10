import type { Form } from '@/types/Form';
import type { Node } from '@/types/Node';
import type { Page } from '@/types/Page';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { FormSchemaData } from '@/validations/FormValidation';
import type { PageConditionFormSchemaData } from '@/validations/PageConditionValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import { createContext } from 'react';

export interface FormBuilderContextType {
  forms: Form[];
  selectedForm: Form | undefined;
  pages: Page[];
  selectedPage: Page | undefined;
  inputFieldNodes: Node[] | undefined;
  //
  addForm: (data: FormSchemaData) => void;
  getForm: (id: string) => void;
  updateForm: (id: string, data: Partial<FormSchemaData>) => void;
  deleteForm: (id: string) => void;
  //
  refreshPages: () => void;
  addPage: (data: PageFormSchemaData) => void;
  getPage: (id: string, fetchInputNodes?: boolean) => void;
  updatePage: (
    id: string,
    initialData: PageFormSchemaData,
    data: Partial<PageFormSchemaData>,
  ) => void;
  deletePage: (id: string) => void;
  updatePageOrder: (pages: Page[]) => void;
  addPageConditions: (
    pageNodeId: string,
    conditions: PageConditionFormSchemaData,
  ) => void;
  updateCondition: (
    conditionId: string,
    condition: ConditionFormSchemaData,
  ) => void;
  deleteCondition: (conditionId: string) => void;
  //
  exportForm: (id: string, fileName: string) => void;
  importForm: (data: unknown) => Promise<string | undefined>;
  clearAllFormPages: (pageIds: string[]) => void;
}

export const FormBuilderContext = createContext<
  FormBuilderContextType | undefined
>(undefined);
