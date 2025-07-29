import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  NodeFormSchema,
  convertGraphNodeToNodeForm,
  type NodeFormSchemaData,
} from '@/validations/NodeValidation.js';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph';
import NodeForm from './NodeForm';

interface IProps {
  className?: string;
}

export default function EditNodeForm({ className }: IProps) {
  const { selectedNode, updateNode, setSheetOpen } = useGraph();

  if (!selectedNode) {
    return;
  }

  const form = useForm<NodeFormSchemaData>({
    resolver: zodResolver(NodeFormSchema),
    defaultValues: convertGraphNodeToNodeForm(selectedNode),
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'validation_rules',
  });

  function onSubmit(data: NodeFormSchemaData) {
    if (!selectedNode?.id) {
      return;
    }

    updateNode(selectedNode?.id, data);
    //
    setSheetOpen(false);
    toast.success('Update node successfully');
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
