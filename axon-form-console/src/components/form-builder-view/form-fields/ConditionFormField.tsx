import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  ConditionExpression,
  NodeFieldType,
  NodeFieldTypeWithOptions,
} from '@/configs/graph';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import DeleteButton from '@/components/DeleteButton';

import { Badge } from '@/components/ui/badge';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import { getValueNodes as getValueNodesService } from '@/services/PocketBaseService';
import { convertPascalCaseToTitleCase } from '@/utils/String.ts';
import type { NodeFormSchemaData } from '@/validations/NodeValidation';
import { useQuery } from '@tanstack/react-query';
import {
  useMemo,
  useEffect,
  useState,
  type MouseEventHandler,
} from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  fieldId: string;
  fieldIndex: number;
  conditionIndex: number;
  //
  onRemoveCondition: MouseEventHandler<HTMLButtonElement>;
}

export default function ConditionFormField({
  fieldId,
  fieldIndex,
  conditionIndex,

  onRemoveCondition,
}: IProps) {
  const { control, setValue, getValues, watch } = useFormContext();
  const { pages, selectedPage } = useFormBuilder();
  const CURRENT_PAGE_KEY = '__current_page__';
  const fieldTypesWithOptions = [...NodeFieldTypeWithOptions, NodeFieldType.Checkbox];
  const [selectedPageFilter, setSelectedPageFilter] =
    useState<string>(CURRENT_PAGE_KEY);

  const currentPageTitle = watch('title') as string | undefined;
  const currentFieldId = watch(`fields.${fieldIndex}.id`) as string | undefined;
  const selectedCheckNodeId = watch(
    `fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`,
  );
  const selectedConditionValue = watch(
    `fields.${fieldIndex}.conditions.${conditionIndex}.value`,
  ) as string | undefined;
  const selectedConditionExpr = watch(
    `fields.${fieldIndex}.conditions.${conditionIndex}.expr`,
  ) as ConditionExpression | undefined;
  const fields = watch('fields') as NodeFormSchemaData[] | undefined;
  const durationUnits = [
    { label: 'Years', value: 'Y' },
    { label: 'Months', value: 'M' },
    { label: 'Weeks', value: 'W' },
    { label: 'Days', value: 'D' },
  ] as const;
  const isDurationExpression =
    selectedConditionExpr === ConditionExpression.DurationLessThan ||
    selectedConditionExpr === ConditionExpression.DurationMoreThan;

  const pageOptions = useMemo(() => {
    const seen = new Set<string>();
    const options = [
      {
        id: CURRENT_PAGE_KEY,
        title:
          currentPageTitle && currentPageTitle.length > 0
            ? `${currentPageTitle} (Current)`
            : 'Current Page',
      },
    ];

    pages.forEach((page) => {
      if (!page.id || seen.has(page.id) || page.id === selectedPage?.id) {
        return;
      }
      seen.add(page.id);
      options.push({
        id: page.id,
        title: page.title,
      });
    });

    return options;
  }, [CURRENT_PAGE_KEY, currentPageTitle, pages, selectedPage?.id]);

  const availableFields = useMemo(() => {
    const currentFields = (fields ?? [])
      .filter((f) => f.id !== currentFieldId)
      .map((field) => ({
        id: field.id,
        label: field.label ?? '',
        field_name: field.field_name ?? '',
        field_type: field.field_type as NodeFieldType | undefined,
        select_options: (field.select_options ?? []).map((option) => ({
          id: option.id,
          value: option.value,
          label: option.label,
        })),
        page_id: CURRENT_PAGE_KEY,
      }));

    const externalFields = pages.flatMap((page) =>
      (page.fields ?? [])
        .filter((field) => field.id !== currentFieldId)
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

    const dedup = new Map<string, (typeof currentFields)[number]>();
    [...currentFields, ...externalFields].forEach((field) => {
      if (field.id && !dedup.has(field.id)) {
        dedup.set(field.id, field);
      }
    });

    return Array.from(dedup.values());
  }, [CURRENT_PAGE_KEY, currentFieldId, fields, pages]);

  const selectedCheckField = availableFields.find(
    (f) => f.id === selectedCheckNodeId,
  );
  const selectedPageKey = selectedCheckField?.page_id ?? selectedPageFilter;
  const filteredAvailableFields = useMemo(() => {
    return availableFields.filter((field) => field.page_id === selectedPageKey);
  }, [availableFields, selectedPageKey]);
  const selectedFieldSupportsOptions =
    !!selectedCheckField?.field_type &&
    fieldTypesWithOptions.includes(selectedCheckField.field_type);

  const { data: selectedFieldOptionNodes } = useQuery({
    queryKey: ['conditionFieldOptions', selectedCheckField?.id],
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
    if (selectedCheckField?.page_id && selectedCheckField.page_id !== selectedPageFilter) {
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
      setValue(
        `fields.${fieldIndex}.conditions.${conditionIndex}.value`,
        matchedByValue.id,
      );
    }
  }, [
    conditionIndex,
    fieldIndex,
    selectedConditionValue,
    selectedFieldOptions,
    selectedFieldSupportsOptions,
    setValue,
  ]);

  return (
    <div
      key={fieldId}
      className='w-full space-y-2 bg-secondary/30 border border-secondary p-4 rounded-sm last:mb-2'
    >
      <div className='flex justify-between items-center'>
        <FormLabel>Condition {conditionIndex + 1}</FormLabel>
        <DeleteButton
          onClick={onRemoveCondition}
          showConfirmationDialog={false}
        />
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
                  setValue(
                    `fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`,
                    '',
                  );
                  setValue(
                    `fields.${fieldIndex}.conditions.${conditionIndex}.value`,
                    '',
                  );
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
              control={control}
              name={`fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`}
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        setValue(
                          `fields.${fieldIndex}.conditions.${conditionIndex}.check_node_id`,
                          value,
                        );
                        setValue(
                          `fields.${fieldIndex}.conditions.${conditionIndex}.value`,
                          '',
                        );
                      }}
                      value={field.value || ''}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a field'>
                            {(() => {
                              const selectedField = selectedCheckField;
                              if (!selectedField) return null;
                              return (
                                <div className='flex flex-row items-center gap-2'>
                                  <span>{selectedField.label}</span>
                                  <Badge
                                    variant='outline'
                                    className='text-gray-400'
                                  >
                                    {selectedField.field_name}
                                  </Badge>
                                </div>
                              );
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredAvailableFields.map((field) => {
                          return (
                            <SelectItem key={field.id} value={field.id!}>
                              <div className='flex flex-col items-start'>
                                <p>{field.label}</p>
                                <span className='text-gray-400 text-xs'>
                                  {field.field_name}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`fields.${fieldIndex}.conditions.${conditionIndex}.expr`}
              render={({ field }) => (
                <FormItem className='col-span-1'>
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        `fields.${fieldIndex}.conditions.${conditionIndex}.expr`,
                        value as ConditionExpression,
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
              control={control}
              name={`fields.${fieldIndex}.conditions.${conditionIndex}.value`}
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormControl>
                    {(() => {
                      if (isDurationExpression) {
                        const matchedDuration = field.value
                          ?.toString()
                          .match(/^(\d+)([YMWD])$/i);
                        const durationAmount = matchedDuration?.[1] ?? '';
                        const durationUnit = (
                          matchedDuration?.[2]?.toUpperCase() ?? 'Y'
                        ) as 'Y' | 'M' | 'W' | 'D';

                        return (
                          <div className='grid grid-cols-2 gap-2'>
                            <Input
                              type='number'
                              min={0}
                              placeholder='Enter number'
                              value={durationAmount}
                              onChange={(event) => {
                                const nextAmount = event.target.value;
                                setValue(
                                  `fields.${fieldIndex}.conditions.${conditionIndex}.value`,
                                  nextAmount ? `${nextAmount}${durationUnit}` : '',
                                );
                              }}
                            />
                            <Select
                              value={durationUnit}
                              onValueChange={(nextUnit) => {
                                setValue(
                                  `fields.${fieldIndex}.conditions.${conditionIndex}.value`,
                                  durationAmount
                                    ? `${durationAmount}${nextUnit}`
                                    : '',
                                );
                              }}
                            >
                              <FormControl className='w-full'>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select unit' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {durationUnits.map((unit) => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      }

                      if (selectedFieldSupportsOptions) {
                        return (
                          <Select
                            value={field.value || ''}
                            onValueChange={field.onChange}
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
                        return (
                          <Input
                            type='date'
                            placeholder='Select a date'
                            {...field}
                          />
                        );
                      }

                      return (
                        <Input placeholder='Enter condition value' {...field} />
                      );
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
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.type`}
            render={() => (
              <FormItem className='col-span-1'>
                <Input value={'Show'} disabled />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`fields.${fieldIndex}.conditions.${conditionIndex}.message`}
            render={() => (
              <FormItem className='col-span-3'>
                <FormControl>
                  <Input
                    value={getValues(`fields.${fieldIndex}.label`)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
