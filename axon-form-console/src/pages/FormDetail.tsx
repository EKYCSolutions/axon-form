import Header from '@/components/form-builder-view/Header.js';
import LoadingContainer from '@/components/LoadingContainer.js';
import NavButton from '@/components/NavButton.js';
import { Button } from '@/components/ui/button.js';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.js';
import { Input } from '@/components/ui/input.js';
import { Separator } from '@/components/ui/separator.js';
import { useFormBuilder } from '@/hooks/useFormBuilder.js';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout.js';
import { cn } from '@/lib/utils.js';
import {
  FormSchema,
  type FormSchemaData,
} from '@/validations/FormValidation.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import FormPageList from './FormPageList.js';

export default function FormDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  //
  const { selectedForm, getForm, updateForm } = useFormBuilder();
  const hasInitialized = useRef(false);
  const [loading, setLoading] = useState<boolean>(true);

  const form = useForm<FormSchemaData>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      getForm(id);
    }
  }, []);

  useEffect(() => {
    if (selectedForm && selectedForm.id == id && !hasInitialized.current) {
      //
      form.reset(selectedForm);
      //
      setLoading(false);
      hasInitialized.current = true;
    }
  }, [selectedForm]);

  function onSubmit(data: FormSchemaData) {
    if (!id) {
      return;
    }
    updateForm(id, data);
    form.reset(data);
  }

  if (loading) {
    return (
      <LoadingContainer
        title='Loading Form Details'
        description='Please wait while we fetch the form information.'
      />
    );
  }

  return (
    <FormBuilderViewLayout>
      <NavButton
        title='Back'
        icon={<ArrowLeft />}
        onClick={() => {
          navigate(-1);
        }}
        className='mt-4'
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('space-y-6')}
        >
          <div className='flex justify-between items-center gap-4 mt-8'>
            <Header
              title={
                form.watch('title') && form.watch('title').length > 0
                  ? form.watch('title')
                  : 'Enter a form title'
              }
            />
            <Button
              variant='secondary'
              disabled={!form.formState.isValid || !form.formState.isDirty}
            >
              Save
            </Button>
          </div>
          <Separator className='my-8' />
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel required>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter the title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter the description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
      <Separator />
      <FormPageList />
    </FormBuilderViewLayout>
  );
}
