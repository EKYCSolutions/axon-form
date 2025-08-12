import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { capitalize, convertSnakeCaseToTitleCase } from '@/utils/string';
import { useGraph } from './hooks/useGraph';
import ReadonlyContainer from './ReadonlyContainer';

interface IProps {
  className?: string;
}

export default function EdgeDetail({ className }: IProps) {
  const { selectedEdge, setSheetType } = useGraph();

  if (!selectedEdge) {
    return;
  }

  return (
    <Card
      className={cn(
        'w-full max-w-sm bg-transparent p-0 border-none',
        className,
      )}
    >
      <CardContent className='px-0'>
        <div className='flex flex-col gap-4'>
          <ReadonlyContainer title='ID' text={selectedEdge.id} copyable />
          <ReadonlyContainer title='Label' text={selectedEdge.label} copyable />
          <ReadonlyContainer
            title='Source Node'
            text={selectedEdge.sourceNode}
            copyable
          />
          <ReadonlyContainer
            title='Target Node'
            text={capitalize(selectedEdge.targetNode)}
          />
          <ReadonlyContainer
            title='Edge type'
            text={convertSnakeCaseToTitleCase(selectedEdge.edgeType)}
          />
          {selectedEdge?.conditions &&
            selectedEdge.conditions.map((condition, idx) => (
              <div key={idx} className='space-y-2'>
                <h2 className='text-sm'>Condition {idx + 1}</h2>
                <ReadonlyContainer
                  text={convertSnakeCaseToTitleCase(condition.expression)}
                />
                <ReadonlyContainer text={condition.expected_value.toString()} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
