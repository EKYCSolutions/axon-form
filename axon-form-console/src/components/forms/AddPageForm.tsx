import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  PageFormSchema,
  PageFormSchemaDefaultValue,
  type PageFormSchemaData,
} from '@/validations/PageValidation';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph';
import PageForm from './PageForm';

interface IProps {
  className?: string;
}

export default function AddPageForm({ className }: IProps) {
  const { setSheetOpen, addPage } = useGraph();

  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    defaultValues: PageFormSchemaDefaultValue,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  function onSubmit(data: PageFormSchemaData) {
    addPage(data);

    form.reset();
    setSheetOpen(false);
    toast.success('Added group condition successfully');
  }

  return <PageForm form={form} onSubmit={onSubmit} className={className} />;
}
