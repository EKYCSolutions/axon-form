import DragAndDropWrapper from '@/components/DragAndDropWrapper';
import FormAccordion from '@/components/form-builder-view/FormAccordion';
import PageHeader from '@/components/form-builder-view/PageHeader';
import SelectFieldTypeDialog from '@/components/form-builder-view/SelectFieldTypeDialog';
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
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { cn } from '@/lib/utils';
import {
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import { type DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

export default function CreatePageForm() {
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

  function onSubmit(data: PageFormSchemaData) {
    console.log(data);
    // addPage(data);

    // form.reset();
    // setSheetOpen(false);
    // toast.success('Added group condition successfully');
  }

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
    console.log(active, over);

    if (!over || active.id === over.id) return;

    const oldIndex = formFields.findIndex((f) => f.id === active.id);
    const newIndex = formFields.findIndex((f) => f.id === over.id);

    move(oldIndex, newIndex); // ✅ reorder field array
    return;

    // if (active && over && active.id !== over.id) {
    //   setData((data) => {
    //     const oldIndex = dataIds.indexOf(active.id);
    //     const newIndex = dataIds.indexOf(over.id);
    //     return arrayMove(data, oldIndex, newIndex);
    //   });
    // }
  }

  return (
    <FormBuilderViewLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('space-y-6')}
        >
          <div className='flex justify-between items-center mt-8 gap-4'>
            <PageHeader
              title={
                form.watch('title') && form.watch('title').length > 0
                  ? form.watch('title')
                  : 'Enter a page title'
              }
            />
            <Button variant='secondary' disabled={!form.formState.isValid}>
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
                      fieldType={field.field_type}
                      fieldLabel={form.watch(`fields.${idx}.label`)}
                      //
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
