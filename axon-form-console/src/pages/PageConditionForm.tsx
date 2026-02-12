import CustomAlertDialog from '@/components/CustomAlertDialog';
import DeleteButton from '@/components/DeleteButton';
import PageHeader from '@/components/form-builder-view/PageHeader';
import NavButton from '@/components/NavButton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ConditionExpression } from '@/configs/graph';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { cn } from '@/lib/utils';
import { getFieldArrayChanges } from '@/utils/Form';
import { convertPascalCaseToTitleCase } from '@/utils/String';
import {
  PageConditionFormSchema,
  type PageConditionFormSchemaData,
} from '@/validations/PageConditionValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

export default function PageConditionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  //
  const {
    selectedPage,
    inputFieldNodes,
    getPage,
    addPageConditions,
    updateCondition,
    deleteCondition,
  } = useFormBuilder();
  //
  const [initialPageConditions, setInitialPageConditions] =
    useState<PageConditionFormSchemaData>();

  useEffect(() => {
    if (id) {
      getPage(id, true);
    }

    if (selectedPage) {
      const pageConditions = selectedPage.conditions?.filter(
        (cond) => cond.target_node_id == selectedPage.node_id,
      );

      setInitialPageConditions({
        conditions:
          pageConditions?.map((cond) => ({
            id: cond.id,
            edge: cond.edge,
            check_node_id: cond.check_node,
            expr: cond.expr as ConditionExpression,
            value: cond.value.toString(),
          })) ?? [],
      });

      form.reset({
        conditions: pageConditions?.map((cond) => ({
          id: cond.id,
          edge: cond.edge,
          check_node_id: cond.check_node,
          expr: cond.expr as ConditionExpression,
          value: cond.value.toString(),
        })),
      });
    }
  }, [id, getPage, selectedPage]);

  const form = useForm<PageConditionFormSchemaData>({
    resolver: zodResolver(PageConditionFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    fields: conditionFields,
    append: appendConditionField,
    remove: removeConditionField,
  } = useFieldArray({
    control: form.control,
    name: 'conditions',
  });

  //
  function onSubmit(data: PageConditionFormSchemaData) {
    if (!selectedPage?.node_id || !initialPageConditions) {
      return;
    }

    const { added, deleted, updated } = getFieldArrayChanges(
      initialPageConditions.conditions,
      data.conditions,
    );

    if (added.length > 0) {
      addPageConditions(selectedPage?.node_id, { conditions: added });
    }

    if (deleted.length > 0) {
      deleted.forEach((cond) => deleteCondition(cond.id));
    }

    if (updated.length > 0) {
      updated.forEach((cond) => updateCondition(cond.id, cond));
    }
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
            <PageHeader title={'Page Conditions'} />
            <Button
              variant='secondary'
              disabled={!form.formState.isValid || !form.formState.isDirty}
            >
              Save
            </Button>
          </div>
          <Separator className='mt-4 mb-6' />
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <p className='mb-1 flex items-center gap-2 text-sm leading-none font-medium select-none'>
                Title
              </p>
              <Input value={selectedPage?.title} disabled />
            </div>
            <div className='flex flex-col gap-2'>
              <p className='mb-1 flex items-center gap-2 text-sm leading-none font-medium select-none'>
                Description
              </p>
              <Input value={selectedPage?.description} disabled />
            </div>
          </div>
          <Separator className='mt-4 mb-6' />
          {conditionFields.map((field, index) => {
            return (
              <div
                key={field.id}
                className='w-full space-y-2 bg-secondary/30 border border-secondary p-4 rounded-sm last:mb-2'
              >
                <div className='flex justify-between items-center'>
                  <p className='mb-1 flex items-center gap-2 text-sm leading-none font-medium select-none'>
                    Condition {index + 1}
                  </p>
                  <DeleteButton
                    onClick={() => removeConditionField(index)}
                    showConfirmationDialog={false}
                  />
                </div>
                <div className='w-full flex items-center gap-2'>
                  <p className='text-primary/50 w-12'>When Field</p>
                  <div className='grid grid-cols-5 gap-2 w-full'>
                    <FormField
                      control={form.control}
                      name={`conditions.${index}.check_node_id`}
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <Select
                            onValueChange={(value) => {
                              form.setValue(
                                `conditions.${index}.check_node_id`,
                                value,
                                { shouldDirty: true },
                              );
                            }}
                            value={field.value || ''}
                          >
                            <FormControl className='w-full'>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select a field' />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              {inputFieldNodes?.map((field) => {
                                return (
                                  <SelectItem key={field.id} value={field.id!}>
                                    {field.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`conditions.${index}.expr`}
                      render={({ field }) => (
                        <FormItem className='col-span-1'>
                          <Select
                            onValueChange={(value) =>
                              form.setValue(
                                `conditions.${index}.expr`,
                                value as ConditionExpression,
                                { shouldDirty: true },
                              )
                            }
                            value={field.value || ''}
                          >
                            <FormControl className='w-full'>
                              <SelectTrigger>
                                <SelectValue placeholder='Select an expression' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(ConditionExpression).map(
                                ([key, value]) => (
                                  <SelectItem key={value} value={value}>
                                    {convertPascalCaseToTitleCase(key)}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`conditions.${index}.value`}
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormControl>
                            <Input
                              placeholder='Enter condition value'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className='w-full flex items-center gap-2'>
                  <p className='text-primary/50 w-12'>Then</p>
                  <div className='grid grid-cols-4 gap-2 w-full'>
                    <Input className='col-span-1' value={'Show'} disabled />
                    <Input
                      className='col-span-3'
                      value={selectedPage?.title}
                      disabled
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            type='button'
            className='w-full'
            variant='outline'
            onClick={() =>
              appendConditionField({
                check_node_id: '',
                expr: '' as ConditionExpression,
                value: '',
              })
            }
          >
            <Plus />
            Add Condition
          </Button>
        </form>
      </Form>
    </FormBuilderViewLayout>
  );
}
