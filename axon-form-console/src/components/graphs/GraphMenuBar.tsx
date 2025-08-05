import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { GraphSheetType } from '@/configs/graph';
import { cn } from '@/lib/utils.js';
import { ChevronUp, Plus, Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce'; // Import useDebouncedCallback from 'use-debounce'
import { useGraph } from '../hooks/useGraph.js';
import { Input } from '../ui/input.js';
import { Separator } from '../ui/separator.js';

interface IProps {
  className?: string;
}

export default function GraphMenuBar({ className }: IProps) {
  const {
    zoom,
    resetZoom,
    updateZoom,
    setSheetOpen,
    setSheetType,
    setSearchText,
  } = useGraph();

  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setSearchText(value);
      console.log('value >>', value);
    },
    //
    500,
  );

  return (
    <Menubar className={cn('h-10 w-fit gap-2 px-2 rounded-xl', className)}>
      <MenubarMenu>
        <MenubarTrigger
          onClick={() => {
            setSheetOpen(true);
            setSheetType(GraphSheetType.AddNode);
          }}
          className='w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'
        >
          <Plus size={20} />
          Node
        </MenubarTrigger>
        <MenubarTrigger
          onClick={() => {
            setSheetOpen(true);
            setSheetType(GraphSheetType.AddEdge);
          }}
          className='w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'
        >
          <Plus size={20} />
          Edge
        </MenubarTrigger>
        <MenubarTrigger
          onClick={() => {
            setSheetOpen(true);
            setSheetType(GraphSheetType.AddConditionGroup);
          }}
          className='w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'
        >
          <Plus size={20} />
          Condition Group
        </MenubarTrigger>
      </MenubarMenu>
      <Separator orientation='vertical' />
      <div className='relative'>
        <Input
          onChange={(e) => debounced(e.target.value)}
          placeholder='Search'
          className='pl-7 h-7 md:text-xs font-light'
        />
        <Search
          size={15}
          color='gray'
          className='absolute top-1/2 -translate-y-1/2 left-2'
        />
      </div>
      <MenubarMenu>
        <MenubarContent>
          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle Fullscreen</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <Separator orientation='vertical' />

      <MenubarMenu>
        <MenubarTrigger className='w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'>
          {zoom}%
          <ChevronUp size={15} />
        </MenubarTrigger>
        <MenubarContent className='bg-popover text-sm min-w-36'>
          <MenubarItem
            className='text-xs'
            onClick={() => {
              const zoomLevel = (zoom + 10) / 100;
              updateZoom(zoomLevel);
            }}
          >
            Zoom in
          </MenubarItem>
          <MenubarItem
            className='text-xs'
            onClick={() => {
              const zoomLevel = (zoom - 10) / 100;
              updateZoom(zoomLevel);
            }}
          >
            Zoom out
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className='text-xs' onClick={() => updateZoom(1)}>
            Zoom to 100%
          </MenubarItem>
          <MenubarItem className='text-xs' onClick={() => updateZoom(0.75)}>
            Zoom to fit
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className='text-xs' onClick={() => resetZoom()}>
            Reset zoom
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
