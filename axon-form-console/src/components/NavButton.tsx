import { cn } from '@/lib/utils';
import type React from 'react';
import type { MouseEventHandler } from 'react';

interface IProps {
  className?: string;
  title: string;
  icon: React.ReactNode;
  //
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function NavButton({ className, title, icon, onClick }: IProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4 hover:underline',
        className,
      )}
    >
      {icon}
      <p className='text-sm'>{title}</p>
    </button>
  );
}
