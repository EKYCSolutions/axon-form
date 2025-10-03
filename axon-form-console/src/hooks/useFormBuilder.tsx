import { FormBuilderContext } from '@/contexts/FormBuilderContext';
import { useContext } from 'react';

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}
