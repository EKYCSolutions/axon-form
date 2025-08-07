import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { GraphSheetType } from '@/configs/graph';
import { cn } from '@/lib/utils.js';
import { ChevronUp, Plus, Search, Trash2Icon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce'; // Import useDebouncedCallback from 'use-debounce'
import CustomAlertDialog from '../CustomAlertDialog.js';
import { useGraph } from '../hooks/useGraph.js';
import { Input } from '../ui/input.js';
import { Separator } from '../ui/separator.js';

interface IProps {
  className?: string;
}

export default function GraphMenuBar({ className }: IProps) {
  const {
    selectedNodes,
    zoom,
    resetZoom,
    updateZoom,
    setSheetOpen,
    setSheetType,
    setSearchText,
    //
    resetSelectedNodes,
    deleteSelectedNodes,
    duplicatedSelectedNodes,
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
      {selectedNodes.length > 0 ? (
        <>
          <MenubarMenu>
            <MenubarTrigger
              onClick={() => {
                resetSelectedNodes();
              }}
              className='items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-4 py-1  font-normal'
            >
              Cancel
            </MenubarTrigger>
          </MenubarMenu>
          <Separator orientation='vertical' />
          <MenubarMenu>
            <MenubarTrigger className='w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'>
              <span className='font-bold'>{selectedNodes.length}</span> Nodes
              Selected
            </MenubarTrigger>
          </MenubarMenu>

          <Separator orientation='vertical' />
          <CustomAlertDialog
            title='Duplicate the selected items?'
            description='This will create an exact copy of these items with all its current settings and data.'
            onContinueClick={() => duplicatedSelectedNodes()}
          >
            <div className='flex text-white w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'>
              <Plus size={20} />
              Duplicate
            </div>
          </CustomAlertDialog>
          <CustomAlertDialog
            title='Are you absolutely sure?'
            description='This action cannot be undone. This will permanently delete this item and remove all associated data.'
            onContinueClick={() => deleteSelectedNodes()}
          >
            <div className='flex text-red-400 w-fit items-center gap-1 whitespace-nowrap rounded-md text-xs leading-none transition-all bg-input hover:bg-input/80 h-7 px-2 py-1  font-normal'>
              <Trash2Icon size={15} />
              Delete
            </div>
          </CustomAlertDialog>
        </>
      ) : (
        <>
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
        </>
      )}
    </Menubar>
  );
}
