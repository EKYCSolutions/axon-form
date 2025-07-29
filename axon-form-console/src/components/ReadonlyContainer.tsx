import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/utils/Clipboard';
import { Copy } from 'lucide-react';

interface IProps {
  copyable?: boolean;
  title?: string;
  text?: string;
}

export default function ReadonlyContainer({
  title,
  text,
  copyable = false,
}: IProps) {
  return (
    <div className='flex flex-col gap-2'>
      {title && <h2 className='text-sm'>{title}</h2>}
      <div
        className={cn(
          'dark:bg-input/30 border-input flex items-center justify-between w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none',
        )}
      >
        <p className='text-white/70'>{text}</p>
        {copyable && (
          <Copy
            size={15}
            className='hover:cursor-pointer'
            onClick={() => copyToClipboard(text)}
          />
        )}
      </div>
    </div>
  );
}
