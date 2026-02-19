import CustomAlertDialog from '@/components/CustomAlertDialog';
import Header from '@/components/form-builder-view/Header';
import NavButton from '@/components/NavButton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { cn } from '@/lib/utils';
import { FormSchema, type FormSchemaData } from '@/validations/FormValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export default function CreateForm() {
  const navigate = useNavigate();
  const { addForm } = useFormBuilder();
  //
  const form = useForm<FormSchemaData>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  //
  function onSubmit(data: FormSchemaData) {
    addForm(data);
    //
    form.reset(data);
    navigate('/', {});
  }

  return (
    <FormBuilderViewLayout>
      {!form.formState.isValid || !form.formState.isDirty ? (
        <NavButton
          title='Back'
          icon={<ArrowLeft />}
          onClick={() => {
            navigate(-1);
          }}
          className='mt-4'
        />
      ) : (
        <CustomAlertDialog
          title='Unsaved Changes'
          description='You have unsaved changes. Are you sure you want to go back? Any changes will be lost.'
          continueText='Proceed'
          onContinueClick={() => {
            navigate(-1);
          }}
        >
          <NavButton
            title='Back'
            icon={<ArrowLeft />}
            onClick={() => {}}
            className='mt-4'
          />
        </CustomAlertDialog>
      )}
      <Separator className='mt-4 mb-6' />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('space-y-6')}
        >
          <div className='flex justify-between items-center gap-4'>
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
    </FormBuilderViewLayout>
  );
}
