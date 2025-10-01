import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import DeleteButton from '@/components/DeleteButton';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { formatIndex } from '@/utils/String.ts';
import type { MouseEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';

interface IProps {
  fieldId: string;
  fieldIndex: number;
  optionIndex: number;
  label: string;
  //
  onRemoveOption: MouseEventHandler<HTMLButtonElement>;
}

export default function OptionFormField({
  fieldId,
  fieldIndex,
  optionIndex,
  label,
  onRemoveOption,
}: IProps) {
  const { control } = useFormContext();

  return (
    <Accordion type='single' collapsible>
      <AccordionItem value='option' className='last:mb-2'>
        <AccordionTrigger className='bg-secondary/50 px-4 hover:no-underline flex justify-between'>
          <div className='w-full flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <p className='font-light text-xs'>
                {formatIndex(fieldIndex + 1)}
              </p>
              <Badge variant='secondary'>
                {label && label.length > 0 ? label : 'Enter option label'}
              </Badge>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className='bg-secondary/20 border border-t-0 p-4 rounded-md rounded-tl-none rounded-tr-none'>
          <div key={fieldId} className='space-y-2 rounded-sm last:mb-2'>
            <div className='flex items-end gap-4'>
              <div className='flex-1 grid grid-cols-2 gap-4'>
                <FormField
                  control={control}
                  name={`fields.${fieldIndex}.select_options.${optionIndex}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          className='font-light text-sm'
                          placeholder='Enter the option label'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`fields.${fieldIndex}.select_options.${optionIndex}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          className='font-light text-sm'
                          placeholder='Enter the option value'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DeleteButton
                onClick={onRemoveOption}
                showConfirmationDialog={false}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
