import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';
import { Spinner } from './ui/spinner';

interface IProps {
  title: string;
  description: string;
}

export default function LoadingContainer({ title, description }: IProps) {
  return (
    <div className='flex items-center justify-center h-full'>
      <Empty className='w-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
