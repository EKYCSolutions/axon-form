import PageForm from '@/components/form-builder-view/PageForm';
import LoadingContainer from '@/components/LoadingContainer';
import { useFormBuilder } from '@/hooks/useFormBuilder';
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
  const { pageId } = useParams();
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
    if (pageId) {
      getPage(pageId);
    }
  }, []);

  useEffect(() => {
    if (selectedPage && selectedPage.id == pageId && !hasInitialized.current) {
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
    if (!pageId || !initialPageSchema) {
      return;
    }
    updatePage(pageId, initialPageSchema, data);
    form.reset(data);
  }

  if (loading) {
    return (
      <LoadingContainer
        title='Loading Page Details'
        description='Please wait while we fetch the page information.'
      />
    );
  }

  return <PageForm form={form} onSubmit={onSubmit} />;
}
