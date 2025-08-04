import { cn } from '@/lib/utils';
import { Trash2Icon } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import { Button } from './ui/button';

interface IProps {
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function DeleteButton({ className, onClick }: IProps) {
  return (
    <Button
      type='button'
      variant='outline'
      className={cn(
        'p-0 dark:border-red-400/50 dark:hover:bg-red-400/20',
        className,
      )}
      onClick={onClick}
    >
      <Trash2Icon className='text-red-400/50' />
    </Button>
  );
}
