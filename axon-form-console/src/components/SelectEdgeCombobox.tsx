'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { FormControl } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { GraphEdge } from '@/types/Graph';

interface IProps {
  idx: number;
  className: string;
  //
  edges: GraphEdge[];
  selectedEdges: GraphEdge[];
  //
  onEdgeSelect: (edge: GraphEdge) => void;
}

export function SelectEdgeCombobox({
  idx,
  className,
  edges,
  selectedEdges,
  onEdgeSelect,
}: IProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant='outline'
            role='combobox'
            className={cn('justify-between', className)}
          >
            {selectedEdges[idx] ? selectedEdges[idx].label : 'Select edge'}
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' className='h-9' />
          <CommandList>
            <CommandEmpty>No edge found.</CommandEmpty>
            <CommandGroup>
              {edges.map((edge) => (
                <CommandItem
                  value={edge?.id}
                  key={edge?.id}
                  onSelect={(value) => {
                    const edgeFound = edges.find((e) => e.id == value);

                    if (edgeFound) {
                      onEdgeSelect(edgeFound);
                    }
                  }}
                >
                  {edge?.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedEdges?.find((e) => e?.id == edge?.id)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
