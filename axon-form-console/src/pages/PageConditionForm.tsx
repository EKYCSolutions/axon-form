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
import {
  ConditionExpression,
  NodeFieldType,
  NodeFieldTypeWithOptions,
} from '@/configs/graph';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { cn } from '@/lib/utils';
import { getValueNodes as getValueNodesService } from '@/services/PocketBaseService';
import { Badge } from '@/components/ui/badge';
import { getFieldArrayChanges } from '@/utils/Form';
import { convertPascalCaseToTitleCase } from '@/utils/String';
import {
  PageConditionFormSchema,
  type PageConditionFormSchemaData,
} from '@/validations/PageConditionValidation';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

const CURRENT_PAGE_KEY = '__current_page__';

interface ConditionFieldOption {
  id?: string;
  value?: string;
  label?: string;
}

interface AvailableConditionField {
  id?: string;
  label?: string;
  field_name?: string;
  field_type?: NodeFieldType;
  select_options: ConditionFieldOption[];
  page_id: string;
}

interface ConditionPageOption {
  id: string;
  title: string;
}

function PageConditionFieldRow({
  form,
  index,
  fieldId,
  onRemove,
  availableFields,
  pageOptions,
  thenLabel,
}: {
  form: UseFormReturn<PageConditionFormSchemaData>;
  index: number;
  fieldId: string;
  onRemove: () => void;
  availableFields: AvailableConditionField[];
  pageOptions: ConditionPageOption[];
  thenLabel?: string;
}) {
  const [selectedPageFilter, setSelectedPageFilter] =
    useState<string>(CURRENT_PAGE_KEY);
  const fieldTypesWithOptions = [...NodeFieldTypeWithOptions, NodeFieldType.Checkbox];

  const selectedCheckNodeId = form.watch(`conditions.${index}.check_node_id`);
  const selectedConditionValue = form.watch(`conditions.${index}.value`);

  const selectedCheckField = availableFields.find(
    (field) => field.id === selectedCheckNodeId,
  );
  const selectedPageKey = selectedCheckField?.page_id ?? selectedPageFilter;
  const filteredAvailableFields = useMemo(
    () => availableFields.filter((field) => field.page_id === selectedPageKey),
    [availableFields, selectedPageKey],
  );

  const selectedFieldSupportsOptions =
    !!selectedCheckField?.field_type &&
    fieldTypesWithOptions.includes(selectedCheckField.field_type);

  const { data: selectedFieldOptionNodes } = useQuery({
    queryKey: ['pageConditionFieldOptions', selectedCheckField?.id],
    queryFn: () => getValueNodesService(selectedCheckField!.id!),
    enabled: !!selectedCheckField?.id && selectedFieldSupportsOptions,
  });

  const selectedFieldOptions = useMemo(() => {
    const localOptions = selectedCheckField?.select_options ?? [];
    if (localOptions.length > 0) {
      return localOptions;
    }

    return (selectedFieldOptionNodes ?? []).map((option) => ({
      id: option.id,
      value: option.value,
      label: option.label,
    }));
  }, [selectedCheckField?.select_options, selectedFieldOptionNodes]);

  useEffect(() => {
    if (!selectedCheckField?.page_id) return;
    if (selectedCheckField.page_id !== selectedPageFilter) {
      setSelectedPageFilter(selectedCheckField.page_id);
    }
  }, [selectedCheckField?.page_id, selectedPageFilter]);

  useEffect(() => {
    if (
      !selectedFieldSupportsOptions ||
      !selectedConditionValue ||
      selectedFieldOptions.length === 0
    ) {
      return;
    }

    const matchedById = selectedFieldOptions.some(
      (option) => option.id === selectedConditionValue,
    );
    if (matchedById) {
      return;
    }

    const matchedByValue = selectedFieldOptions.find(
      (option) => option.value === selectedConditionValue,
    );
    if (matchedByValue?.id && matchedByValue.id !== selectedConditionValue) {
      form.setValue(`conditions.${index}.value`, matchedByValue.id, {
        shouldDirty: false,
      });
    }
  }, [
    form,
    index,
    selectedConditionValue,
    selectedFieldOptions,
    selectedFieldSupportsOptions,
  ]);

  return (
    <div
      key={fieldId}
      className='w-full space-y-2 bg-secondary/30 border border-secondary p-4 rounded-sm last:mb-2'
    >
      <div className='flex justify-between items-center'>
        <p className='mb-1 flex items-center gap-2 text-sm leading-none font-medium select-none'>
          Condition {index + 1}
        </p>
        <DeleteButton onClick={onRemove} showConfirmationDialog={false} />
      </div>
      <div className='w-full flex items-center gap-2'>
        <p className='text-primary/50 w-24'>When Field</p>
        <div className='w-full space-y-2'>
          <FormItem>
            <FormControl>
              <Select
                value={selectedPageKey}
                onValueChange={(value) => {
                  setSelectedPageFilter(value);
                  form.setValue(`conditions.${index}.check_node_id`, '', {
                    shouldDirty: true,
                  });
                  form.setValue(`conditions.${index}.value`, '', {
                    shouldDirty: true,
                  });
                }}
              >
                <FormControl className='w-full'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a page' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pageOptions.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
          <div className='grid grid-cols-6 gap-2 w-full'>
            <FormField
              control={form.control}
              name={`conditions.${index}.check_node_id`}
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        form.setValue(`conditions.${index}.check_node_id`, value, {
                          shouldDirty: true,
                        });
                        form.setValue(`conditions.${index}.value`, '', {
                          shouldDirty: true,
                        });
                      }}
                      value={field.value || ''}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a field'>
                            {(() => {
                              if (!selectedCheckField) return null;
                              return (
                                <div className='flex flex-row items-center gap-2'>
                                  <span>{selectedCheckField.label}</span>
                                  <Badge variant='outline' className='text-gray-400'>
                                    {selectedCheckField.field_name}
                                  </Badge>
                                </div>
                              );
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredAvailableFields.map((optionField) => (
                          <SelectItem key={optionField.id} value={optionField.id!}>
                            <div className='flex flex-col items-start'>
                              <p>{optionField.label}</p>
                              <span className='text-gray-400 text-xs'>
                                {optionField.field_name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                        <SelectValue placeholder='Select expression' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ConditionExpression).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {convertPascalCaseToTitleCase(key)}
                        </SelectItem>
                      ))}
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
                    {(() => {
                      if (selectedFieldSupportsOptions) {
                        return (
                          <Select
                            value={field.value || ''}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <FormControl className='w-full'>
                              <SelectTrigger>
                                <SelectValue placeholder='Select an option' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedFieldOptions.map((option) => (
                                <SelectItem
                                  key={option.id ?? option.value}
                                  value={option.id ?? option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      }

                      if (selectedCheckField?.field_type === NodeFieldType.Date) {
                        return <Input type='date' placeholder='Select a date' {...field} />;
                      }

                      return <Input placeholder='Enter condition value' {...field} />;
                    })()}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      <div className='w-full flex items-center gap-2'>
        <p className='text-primary/50 w-24'>Then</p>
        <div className='grid grid-cols-4 gap-2 w-full'>
          <Input className='col-span-1' value={'Show'} disabled />
          <Input className='col-span-3' value={thenLabel ?? ''} disabled />
        </div>
      </div>
    </div>
  );
}

export default function PageConditionForm() {
  const { id, pageId } = useParams();
  const navigate = useNavigate();
  //
  const {
    selectedPage,
    pages,
    getForm,
    getPage,
    addPageConditions,
    updateCondition,
    deleteCondition,
  } = useFormBuilder();
  //
  const [initialPageConditions, setInitialPageConditions] =
    useState<PageConditionFormSchemaData>();

  const form = useForm<PageConditionFormSchemaData>({
    resolver: zodResolver(PageConditionFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      getForm(id);
    }

    if (pageId) {
      getPage(pageId, true);
    }
  }, [id, pageId, getForm, getPage]);

  useEffect(() => {
    if (!selectedPage || selectedPage.id !== pageId) {
      return;
    }

    const pageConditions = selectedPage.conditions?.filter(
      (cond) => cond.target_node_id == selectedPage.node_id,
    );

    const nextConditions =
      pageConditions?.map((cond) => ({
        id: cond.id,
        edge: cond.edge,
        check_node_id: cond.check_node,
        expr: cond.expr as ConditionExpression,
        value: cond.value.toString(),
      })) ?? [];

    setInitialPageConditions({
      conditions: nextConditions,
    });

    if (!form.formState.isDirty) {
      form.reset({
        conditions: nextConditions,
      });
    }
  }, [selectedPage, pageId, form]);

  const pageOptions = useMemo<ConditionPageOption[]>(() => {
    const options: ConditionPageOption[] = [
      {
        id: CURRENT_PAGE_KEY,
        title: 'Current Page',
      },
    ];

    pages.forEach((page) => {
      if (!page.id || page.id === selectedPage?.id) {
        return;
      }
      options.push({
        id: page.id,
        title: page.title,
      });
    });

    return options;
  }, [pages, selectedPage?.id]);

  const availableFields = useMemo<AvailableConditionField[]>(() => {
    const currentPageFields = (selectedPage?.fields ?? []).map((field) => ({
      id: field.id,
      label: field.label ?? '',
      field_name: field.field_name ?? '',
      field_type: field.field_type as NodeFieldType | undefined,
      select_options: (field.options ?? []).map((option) => ({
        id: option.id,
        value: option.value,
        label: option.label,
      })),
      page_id: CURRENT_PAGE_KEY,
    }));

    const externalFields = pages
      .filter((page) => page.id !== selectedPage?.id)
      .flatMap((page) =>
        (page.fields ?? [])
        .map((field) => ({
          id: field.id,
          label: field.label ?? '',
          field_name: field.field_name ?? '',
          field_type: field.field_type as NodeFieldType | undefined,
          select_options: (field.options ?? []).map((option) => ({
            id: option.id,
            value: option.value,
            label: option.label,
          })),
          page_id: page.id,
        })),
      );

    const dedup = new Map<string, AvailableConditionField>();
    [...currentPageFields, ...externalFields].forEach((field) => {
      if (field.id && !dedup.has(field.id)) {
        dedup.set(field.id, field);
      }
    });

    return Array.from(dedup.values());
  }, [pages, selectedPage]);

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
              <PageConditionFieldRow
                key={field.id}
                form={form}
                index={index}
                fieldId={field.id}
                onRemove={() => removeConditionField(index)}
                availableFields={availableFields}
                pageOptions={pageOptions}
                thenLabel={selectedPage?.title}
              />
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
