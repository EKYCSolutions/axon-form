import CustomAlertDialog from '@/components/CustomAlertDialog';
import DragAndDropWrapper from '@/components/DragAndDropWrapper.js';
import FormAccordion from '@/components/form-builder-view/FormAccordion';
import PageHeader from '@/components/form-builder-view/PageHeader';
import SelectFieldTypeDialog from '@/components/form-builder-view/SelectFieldTypeDialog';
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
import { NodeFieldType, NodeType } from '@/configs/graph';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { cn } from '@/lib/utils';
import {
  convertPageToPageFormSchema,
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import { type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

export default function PageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPage, getPage, updatePage } = useFormBuilder();
  //
  const [loading, setLoading] = useState<boolean>(true);
  //
  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    fields: formFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  useEffect(() => {
    if (id) {
      getPage(id);
    }

    if (selectedPage) {
      form.reset(convertPageToPageFormSchema(selectedPage));
      setLoading(false);
    }
  }, [id, getPage, selectedPage, form]);

  function onAddFormField(fieldType: NodeFieldType) {
    append({
      type: NodeType.Input,
      field_type: fieldType,
      label: '',
      field_name: '',
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = formFields.findIndex((f) => f.id === active.id);
    const newIndex = formFields.findIndex((f) => f.id === over.id);

    move(oldIndex, newIndex);
  }

  function onSubmit(data: PageFormSchemaData) {
    if (!id) {
      return;
    }

    updatePage(id, data);
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

  return (
    <FormBuilderViewLayout>
      {!form.formState.isValid || !form.formState.isDirty ? (
        <NavButton
          title='Back'
          icon={<ArrowLeft />}
          onClick={() => {
            navigate(-1);
          }}
          className='mt-4 mb-5'
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
            <PageHeader
              title={
                form.watch('title') && form.watch('title').length > 0
                  ? form.watch('title')
                  : 'Enter a page title'
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
                    <Input
                      className='font-light text-sm'
                      placeholder='Enter the title'
                      {...field}
                    />
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
                    <Input
                      className='font-light text-sm'
                      placeholder='Enter the description'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* Add Fields Section */}
          <FormField
            control={form.control}
            name='fields'
            render={() => {
              return (
                <FormItem>
                  <FormLabel>Fields</FormLabel>
                  <SelectFieldTypeDialog onFieldTypeSelect={onAddFormField} />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <DragAndDropWrapper handleDragEnd={handleDragEnd}>
            {/* Render Fields */}
            <div className='flex flex-col gap-3'>
              <SortableContext
                items={formFields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {formFields.map((field, idx) => {
                  return (
                    <FormAccordion
                      key={field.id}
                      fieldId={field.id}
                      fieldIndex={idx}
                      fieldType={field.field_type!}
                      fieldLabel={form.watch(`fields.${idx}.label`)}
                      onFieldDelete={() => remove(idx)}
                    />
                  );
                })}
              </SortableContext>
            </div>
          </DragAndDropWrapper>
        </form>
      </Form>
    </FormBuilderViewLayout>
  );
}
