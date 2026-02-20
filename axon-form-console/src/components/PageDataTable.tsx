'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import {
  getAllConditionsFromNode as getAllConditionsFromNodeService,
  getPageNode as getPageNodeService,
} from '@/services/PocketBaseService';
import type { Page } from '@/types/Page';
import { formatIndex } from '@/utils/String';
import { GripVertical, MoreVertical } from 'lucide-react';
import {
  useEffect,
  useId,
  useMemo,
  useState,
  type MouseEventHandler,
} from 'react';
import { useQueries } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import CustomAlertDialog from './CustomAlertDialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

function DraggableRow({
  idx,
  row,
  hiddenConditionsCount,
  onRowClick,
  onViewConditionClick,
  onDelete,
}: {
  idx: number;
  row: Page;
  hiddenConditionsCount: number;
  onRowClick: MouseEventHandler<HTMLTableRowElement>;
  onViewConditionClick: MouseEventHandler<HTMLDivElement>;
  onDelete: (id: string) => void;
}) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.id,
  });

  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 cursor-pointer'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      onClick={onRowClick}
    >
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className='hover:bg-secondary px-1 py-2 rounded-sm'
        >
          <GripVertical size={15} color='gray' />
        </div>
      </TableCell>
      <TableCell>{formatIndex(idx + 1)}</TableCell>
      <TableCell>
        <div className='flex items-center gap-2'>
          <span>{row.title}</span>
          {hiddenConditionsCount > 0 && (
            <Badge variant='destructive'>
              Hidden: {hiddenConditionsCount} conditions
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell
        className='flex items-center justify-between'
        onClick={(e) => e.stopPropagation()}
      >
        {row.fields.length}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
              size='icon'
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-36'>
            <DropdownMenuItem disabled className='cursor-not-allowed'>
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewConditionClick}>
              View Conditions
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <CustomAlertDialog
              title='Are you absolutely sure?'
              description='This action cannot be undone. This will permanently delete this item and remove all associated data.'
              continueText='Delete'
              onContinueClick={() => onDelete(row.id)}
            >
              <DropdownMenuItem
                variant='destructive'
                onSelect={(e) => e.preventDefault()}
              >
                Delete
              </DropdownMenuItem>
            </CustomAlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

interface IProps {
  shouldResetOrder: boolean;
  //
  handleReordering: (status: boolean, pages: Page[]) => void;
  onDelete: (id: string) => void;
}

export function PageDataTable({
  shouldResetOrder,
  handleReordering,
  onDelete,
}: IProps) {
  const navigate = useNavigate();
  const location = useLocation();
  //
  const { pages } = useFormBuilder();
  //
  const [initialData, setInitialData] = useState(pages);
  const [data, setData] = useState(pages);

  useEffect(() => {
    if (shouldResetOrder) {
      setData(initialData);
    }
  }, [shouldResetOrder, initialData]);

  useEffect(() => {
    setData(pages);
    setInitialData(pages);
  }, [pages]);

  const pageConditionQueries = useQueries({
    queries: pages.map((page) => ({
      queryKey: ['pageHiddenConditionsCount', page.id],
      queryFn: async () => {
        const pageNode = await getPageNodeService(page.id);
        const conditions = await getAllConditionsFromNodeService(page.id);
        return conditions.filter((cond) => cond.target_node_id === pageNode.id)
          .length;
      },
      enabled: !!page.id,
    })),
  });

  const hiddenConditionsCountByPageId = useMemo(() => {
    const byId = new Map<string, number>();
    pages.forEach((page, index) => {
      byId.set(page.id, pageConditionQueries[index]?.data ?? 0);
    });
    return byId;
  }, [pageConditionQueries, pages]);

  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);

        // Move the item in the array
        const newData = arrayMove(data, oldIndex, newIndex);

        // Update order field
        const updatedData = newData.map((item, index) => ({
          ...item,
          order: index,
        }));

        handleReordering(
          JSON.stringify(initialData) !== JSON.stringify(updatedData),
          updatedData,
        );

        return updatedData;
      });
    }
  }

  return (
    <div className='overflow-hidden rounded-lg border'>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        id={sortableId}
      >
        <Table>
          <TableHeader className='bg-muted sticky top-0 z-10'>
            <TableRow>
              <TableHead className='w-8'></TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>No. of Fields</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='**:data-[slot=table-cell]:first:w-8'>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {data.map((data, idx) => (
                <DraggableRow
                  key={data.id}
                  idx={idx}
                  row={data}
                  hiddenConditionsCount={
                    hiddenConditionsCountByPageId.get(data.id) ?? 0
                  }
                  onRowClick={() =>
                    navigate(`${location.pathname}/page/${data.id}`)
                  }
                  onViewConditionClick={() =>
                    navigate(`${location.pathname}/page/${data.id}/condition`)
                  }
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
