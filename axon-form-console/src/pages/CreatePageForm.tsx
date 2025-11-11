import PageForm from '@/components/form-builder-view/PageForm';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import {
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export default function CreatePageForm() {
  const navigate = useNavigate();
  const { addPage } = useFormBuilder();

  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  function onSubmit(data: PageFormSchemaData) {
    addPage(data);
    //
    form.reset(data);
    navigate('/page', {});
  }

  return <PageForm form={form} onSubmit={onSubmit} />;
}
