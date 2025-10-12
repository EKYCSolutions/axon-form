import { cn } from '@/lib/utils';
import type { MouseEventHandler } from 'react';

interface IProps {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  //
  className?: string;
}

export default function InputFieldButton({
  title,
  onClick,
  className,
}: IProps) {
  return (
    <button
      className={cn(
        'border rounded-md min-h-12 flex items-center justify-center hover:bg-secondary text-sm',
        className,
      )}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
