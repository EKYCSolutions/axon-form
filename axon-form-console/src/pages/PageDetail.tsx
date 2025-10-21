import PageForm from '@/components/form-builder-view/PageForm';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import {
  convertPageToPageFormSchema,
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';

export default function PageDetail() {
  const { id } = useParams();
  const { selectedPage, getPage, updatePage } = useFormBuilder();
  //
  const hasInitialized = useRef(false);
  const [initialPageSchema, setInitialPageSchema] =
    useState<PageFormSchemaData>();
  const [loading, setLoading] = useState<boolean>(true);
  //
  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      getPage(id);
    }
  }, []);

  useEffect(() => {
    if (selectedPage && selectedPage.id == id && !hasInitialized.current) {
      const pageFormSchema = convertPageToPageFormSchema(selectedPage);
      //
      setInitialPageSchema(pageFormSchema);
      form.reset(pageFormSchema);
      //
      setLoading(false);
      hasInitialized.current = true;
    }
  }, [selectedPage]);

  function onSubmit(data: PageFormSchemaData) {
    if (!id || !initialPageSchema) {
      return;
    }
    updatePage(id, initialPageSchema, data);
    form.reset(data);
  }

  if (loading) {
    return (
      <FormBuilderViewLayout>
        <div className='flex items-center justify-center h-full'>
          <p>Loading Page...</p>
        </div>
      </FormBuilderViewLayout>
    );
  }

  return <PageForm form={form} onSubmit={onSubmit} />;
}
