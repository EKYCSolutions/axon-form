import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { NodeFieldType } from '@/configs/graph';
import { cn } from '@/lib/utils';
import { convertSnakeCaseToTitleCase, formatIndex } from '@/utils/String';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import { Badge } from '../ui/badge';

import { useFormContext } from 'react-hook-form';
import FormAccordionDropdown from './FormAccordionDropdown';
import BaseInputFormField from './form-fields/BaseInputFormField';

function renderFormField(fieldType: NodeFieldType, fieldIndex: number) {
  const formFieldWithOptions = [
    NodeFieldType.MultiSelect,
    NodeFieldType.Radio,
    NodeFieldType.Dropdown,
    NodeFieldType.Checkbox,
  ];

  return (
    <BaseInputFormField
      fieldIndex={fieldIndex}
      hasOptions={formFieldWithOptions.includes(fieldType)}
    />
  );
}

interface IProps {
  fieldId: string;
  fieldIndex: number;
  fieldLabel: string;
  //
  onFieldDelete: MouseEventHandler<HTMLDivElement>;
}

export default function FormAccordion({
  fieldId,
  fieldIndex,
  fieldLabel,
  onFieldDelete,
}: IProps) {
  const { getValues } = useFormContext();

  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({
    id: fieldId,
  });

  return (
    <Accordion ref={setNodeRef} type='single' collapsible>
      <AccordionItem value='item-1'>
        <AccordionTrigger
          className={cn(
            `bg-secondary/50 z-0 px-4 py-2 hover:no-underline flex items-center justify-between`,
            isDragging && 'bg-secondary/70 z-10',
          )}
        >
          <div
            ref={setNodeRef}
            style={{
              transition: transition,
              transform: CSS.Transform.toString(transform),
            }}
            className='w-full flex items-center justify-between gap-2'
          >
            <div className='flex items-center gap-2'>
              <div
                {...attributes}
                {...listeners}
                className='hover:bg-secondary px-1 py-2 rounded-sm'
              >
                <GripVertical size={15} color='gray' />
              </div>
              <p className='font-light text-xs'>
                {formatIndex(fieldIndex + 1)}
              </p>
              <Badge variant='secondary'>
                {convertSnakeCaseToTitleCase(
                  getValues(`fields.${fieldIndex}.field_type`),
                )}
              </Badge>
              {fieldLabel}
            </div>
            <FormAccordionDropdown onDelete={onFieldDelete} />
          </div>
        </AccordionTrigger>
        <AccordionContent className='bg-secondary/20 border border-t-0 p-4 rounded-md rounded-tl-none rounded-tr-none'>
          {renderFormField(
            getValues(`fields.${fieldIndex}.field_type`),
            fieldIndex,
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
