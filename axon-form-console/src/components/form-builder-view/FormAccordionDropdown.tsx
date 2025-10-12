import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import type { MouseEventHandler } from 'react';

interface IProps {
  onDelete: MouseEventHandler<HTMLDivElement>;
}

export default function FormAccordionDropdown({ onDelete }: IProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          asChild
          variant='ghost'
          className='px-0 py-0 h-auto'
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
