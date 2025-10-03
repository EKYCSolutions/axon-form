import type { Page } from '@/types/Page';
import type { PageFormSchemaData } from '@/validations/PageFormValidation';
import { createContext } from 'react';

export interface FormBuilderContextType {
  pages: Page[];
  selectedPage: Page | undefined;
  addPage: (data: PageFormSchemaData) => void;
  getPage: (id: string) => void;
}

export const FormBuilderContext = createContext<
  FormBuilderContextType | undefined
>(undefined);
