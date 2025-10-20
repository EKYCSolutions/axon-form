import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useFormBuilder } from '@/hooks/useFormBuilder';
import {
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import GraphPageForm from './GraphPageForm.js';

interface IProps {
  className?: string;
}

export default function AddPageForm({ className }: IProps) {
  const { addPage } = useFormBuilder();

  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  function onSubmit(data: PageFormSchemaData) {
    addPage(data);

    // form.reset();
    // setSheetOpen(false);
    // toast.success('Added group condition successfully');
  }

  return (
    <GraphPageForm form={form} onSubmit={onSubmit} className={className} />
  );
}
