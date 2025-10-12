import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { inputFieldTypes } from '@/configs/fields';
import type { NodeFieldType } from '@/configs/graph';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import InputFieldButton from './InputFieldButton';

interface IProps {
  onFieldTypeSelect: (value: NodeFieldType) => void;
}

export default function SelectFieldTypeDialog({ onFieldTypeSelect }: IProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='mt-2'>
          <Plus /> Add Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Field Type</DialogTitle>
          <DialogDescription>
            Please select an input field type
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-4 gap-2'>
          {inputFieldTypes.map((field) => {
            return (
              <DialogClose key={field.value} asChild>
                <InputFieldButton
                  title={field.label}
                  onClick={() => onFieldTypeSelect(field.type)}
                />
              </DialogClose>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
