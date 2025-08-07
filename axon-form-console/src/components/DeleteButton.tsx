import { cn } from '@/lib/utils';
import { Trash2Icon } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import CustomAlertDialog from './CustomAlertDialog';

interface IProps {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function DeleteButton({ className, onClick }: IProps) {
  return (
    <CustomAlertDialog
      title='Are you absolutely sure?'
      description='This action cannot be undone. This will permanently delete this item and remove all associated data.'
      continueText='Delete'
      onContinueClick={onClick}
    >
      <div
        className={cn(
          'p-2 rounded-md border border-red-400/50 hover:bg-red-400/20 flex items-center justify-center',
          className,
        )}
      >
        <Trash2Icon className='text-red-400/50' size={17} />
      </div>
    </CustomAlertDialog>
  );
}
