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
  const { selectedPage, getPage, updatePage } = useFormBuilder();
  //
  const [dirtyInputFields, setDirtyInputFields] = useState([]);
  //
  const navigate = useNavigate();

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

  return (
    <FormBuilderViewLayout>
      <NavButton
        title='Back'
        icon={<ArrowLeft />}
        onClick={() => navigate(-1)}
        className='mt-4'
      />
      <Separator className='mt-4 mb-6' />
      <p>{JSON.stringify(form.formState.dirtyFields)}</p>
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
