import type { Node } from '@/types/Node';
import type { Page } from '@/types/Page';
import type { ConditionFormSchemaData } from '@/validations/ConditionValidation';
import type { PageConditionFormSchemaData } from '@/validations/PageConditionValidation';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import { createContext } from 'react';

export interface FormBuilderContextType {
  pages: Page[];
  selectedPage: Page | undefined;
  inputFieldNodes: Node[] | undefined;
  //
  refreshPages: () => void;
  addPage: (data: PageFormSchemaData) => void;
  getPage: (id: string, fetchInputNodes?: boolean) => void;
  updatePage: (id: string, data: Partial<PageFormSchemaData>) => void;
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
  exportForm: (fileName: string) => void;
}

export const FormBuilderContext = createContext<
  FormBuilderContextType | undefined
>(undefined);
