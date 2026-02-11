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
import type { GraphNode } from '@/types/Graph';

interface IProps {
  className: string;
  //
  nodes: GraphNode[];
  selectedNode: GraphNode | undefined;
  //
  onNodeSelect: (node: GraphNode) => void;
}

export function SelectNodeCombobox({
  className,
  nodes,
  selectedNode,
  onNodeSelect,
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
            {selectedNode ? selectedNode.label : 'Select node'}
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command
          filter={(value, search) => {
            const item = nodes.find((item) => item.id === value);
            return item?.label.toLowerCase().includes(search.toLowerCase())
              ? 1
              : 0;
          }}
        >
          <CommandInput placeholder='Search framework...' className='h-9' />
          <CommandList>
            <CommandEmpty>No node found.</CommandEmpty>
            <CommandGroup>
              {nodes.map((node) => (
                <CommandItem
                  value={node?.id}
                  key={node?.id}
                  onSelect={(value) => {
                    const nodeFound = nodes.find((e) => e.id == value);

                    if (nodeFound) {
                      onNodeSelect(nodeFound);
                    }
                  }}
                >
                  {node?.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedNode?.id == node?.id
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
