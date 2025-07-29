import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { capitalize, convertSnakeCaseToTitleCase } from '@/utils/string';
import { useGraph } from './hooks/useGraph';
import ReadonlyContainer from './ReadonlyContainer';
import { Button } from './ui/button';

interface IProps {
  className?: string;
}

export default function EdgeDetail({ className }: IProps) {
  const { selectedEdge } = useGraph();

  return (
    <Card
      className={cn(
        'w-full max-w-sm bg-transparent p-0 border-none',
        className,
      )}
    >
      <CardContent className='px-0'>
        <div className='flex flex-col gap-4'>
          <ReadonlyContainer title='ID' text={selectedEdge?.id} copyable />
          <ReadonlyContainer
            title='Source Node'
            text={selectedEdge?.sourceNode}
            copyable
          />
          <ReadonlyContainer
            title='Target Node'
            text={capitalize(selectedEdge?.targetNode)}
          />
          <ReadonlyContainer
            title='Edge type'
            text={convertSnakeCaseToTitleCase(
              selectedEdge?.edgeType.toString(),
            )}
          />
        </div>
      </CardContent>
      <Button variant='outline'>Add Condition</Button>
    </Card>
  );
}
