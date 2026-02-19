import PageForm from '@/components/form-builder-view/PageForm';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import {
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

export default function CreatePageForm() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { addPage } = useFormBuilder();

  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useMemo(() => {
    if (!id) return;

    form.setValue('form', id);
  }, [id]);

  function onSubmit(data: PageFormSchemaData) {
    addPage(data);
    //
    form.reset(data);
    navigate(-1);
  }

  return <PageForm form={form} onSubmit={onSubmit} />;
}
