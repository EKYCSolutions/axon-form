import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  convertGraphEdgeToEdgeForm,
  EdgeFormSchema,
  type EdgeFormSchemaData,
} from '@/validations/EdgeValidation';
import { useEffect } from 'react';
import { useGraph } from '../hooks/useGraph';
import EdgeForm from './EdgeForm';

interface IProps {
  className?: string;
}

export default function EditEdgeForm({ className }: IProps) {
  const { sourceNode, targetNode, selectedEdge, updateEdge, setSheetOpen } =
    useGraph();

  const form = useForm<EdgeFormSchemaData>({
    resolver: zodResolver(EdgeFormSchema),
    defaultValues: convertGraphEdgeToEdgeForm(selectedEdge),
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'conditions',
  });

  function onSubmit(data: EdgeFormSchemaData) {
    if (!selectedEdge?.id) {
      return;
    }

    //
    updateEdge(
      selectedEdge?.id,
      data,
      convertGraphEdgeToEdgeForm(selectedEdge),
    );
    //
    setSheetOpen(false);
  }

  useEffect(() => {
    if (sourceNode) {
      form.setValue('source_node', sourceNode.id);
    }
    //
    if (targetNode) {
      form.setValue('target_node', targetNode.id);
    }
  }, [sourceNode, targetNode, form]);

  return (
    <EdgeForm
      form={form}
      fieldArray={fieldArray}
      onSubmit={onSubmit}
      className={className}
    />
  );
}
