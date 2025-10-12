import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  NodeFormSchema,
  type NodeFormSchemaData,
} from '@/validations/NodeValidation';
import { toast } from 'sonner';
import { useGraph } from '../../hooks/useGraph.js';
import NodeForm from './NodeForm';

interface IProps {
  className?: string;
}

export default function AddNodeForm({ className }: IProps) {
  const { addNode, setSheetOpen } = useGraph();

  const form = useForm<NodeFormSchemaData>({
    resolver: zodResolver(NodeFormSchema),
    mode: 'onChange',
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'validation_rules',
  });

  function onSubmit(data: NodeFormSchemaData) {
    addNode(data);

    form.reset();
    setSheetOpen(false);
    toast.success('Added node successfully');
  }

  return (
    <NodeForm
      form={form}
      fieldArray={fieldArray}
      onSubmit={onSubmit}
      className={className}
    />
  );
}
