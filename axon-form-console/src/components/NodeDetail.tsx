import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { capitalize, convertPascalCaseToTitleCase } from '@/utils/string';
import { useGraph } from './hooks/useGraph';
import ReadonlyContainer from './ReadonlyContainer';

interface IProps {
  className?: string;
}

export default function NodeDetail({ className }: IProps) {
  const { selectedNode } = useGraph();

  return (
    <Card
      className={cn(
        'w-full max-w-sm bg-transparent p-0 border-none',
        className,
      )}
    >
      <CardContent className='px-0'>
        <div className='flex flex-col gap-4'>
          <ReadonlyContainer title='ID' text={selectedNode?.id} copyable />
          <ReadonlyContainer
            title='Label'
            text={selectedNode?.label}
            copyable
          />
          <ReadonlyContainer
            title='Node type'
            text={capitalize(selectedNode?.nodeType)}
          />
          {selectedNode?.fieldType && (
            <ReadonlyContainer
              title='Field type'
              text={capitalize(selectedNode?.fieldType)}
            />
          )}
          {selectedNode?.validations &&
            selectedNode.validations.map((validation, idx) => (
              <div key={idx} className='space-y-2'>
                <h2 className='text-sm'>Validation {idx + 1}</h2>
                <ReadonlyContainer
                  text={convertPascalCaseToTitleCase(validation.type)}
                />
                {validation?.value && (
                  <ReadonlyContainer text={validation.value?.toString()} />
                )}
                <ReadonlyContainer text={validation.message} />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
