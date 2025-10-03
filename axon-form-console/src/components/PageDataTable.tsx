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
import type { Page } from '@/types/Page';
import { GripVertical } from 'lucide-react';
import { useId, useMemo, useState, type MouseEventHandler } from 'react';
import { useNavigate } from 'react-router';

function DraggableRow({
  row,
  onRowClick,
}: {
  row: Page;
  onRowClick: MouseEventHandler<HTMLTableRowElement>;
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
      <TableCell>{row.title}</TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.fields.length}</TableCell>
    </TableRow>
  );
}

interface IProps {
  pages: Page[];
}

export function PageDataTable({ pages }: IProps) {
  const navigate = useNavigate();
  const [data, setData] = useState(pages);

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
        return arrayMove(data, oldIndex, newIndex);
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
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>No. of Fields</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='**:data-[slot=table-cell]:first:w-8'>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {data.map((data) => (
                <DraggableRow
                  key={data.id}
                  row={data}
                  onRowClick={() => navigate(`/page/${data.id}`)}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
