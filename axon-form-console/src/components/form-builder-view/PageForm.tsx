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
import { NodeType, type NodeFieldType } from '@/configs/graph';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { cn } from '@/lib/utils';
import { type PageFormSchemaData } from '@/validations/PageFormValidation';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ArrowLeft } from 'lucide-react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  form: UseFormReturn<PageFormSchemaData>;
  onSubmit: (data: PageFormSchemaData) => void;
  //
}

export default function PageForm({ form, onSubmit }: IProps) {
  const navigate = useNavigate();
  //

  const {
    fields: formFields,
    append,
    remove,
    move,
  } = useFieldArray<PageFormSchemaData>({
    control: form.control,
    name: 'fields',
  });

  function onAddFormField(fieldType: NodeFieldType) {
    append({
      id: uuidv4(),
      type: NodeType.Input,
      order: formFields.length,
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

    const fields = form.getValues('fields');
    const newFields = arrayMove(fields, oldIndex, newIndex);

    const updatedFields = newFields.map((item, idx) => ({
      ...item,
      order: idx,
    }));

    updatedFields.forEach((item) => {
      const fieldIdx = fields.findIndex((f) => f.id == item.id);

      form.setValue(`fields.${fieldIdx}.order`, item.order, {
        shouldDirty: true,
      });
    });

    move(oldIndex, newIndex);
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
            <div className='flex flex-col gap-3 pb-8'>
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
