import type { Page } from '@/types/Page';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import { createContext } from 'react';

export interface FormBuilderContextType {
  pages: Page[];
  selectedPage: Page | undefined;
  refreshPages: () => void;
  addPage: (data: PageFormSchemaData) => void;
  getPage: (id: string) => void;
  updatePage: (id: string, data: PageFormSchemaData) => void;
  updatePageOrder: (pages: Page[]) => void;
  //
  exportForm: (fileName: string) => void;
}

export const FormBuilderContext = createContext<
  FormBuilderContextType | undefined
>(undefined);
