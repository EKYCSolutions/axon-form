import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import {
  EdgeFormSchema,
  EdgeFormSchemaDefaultValue,
  type EdgeFormSchemaData,
} from '@/validations/EdgeValidation.js';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph.js';
import EdgeForm from './EdgeForm.js';

interface IProps {
  className?: string;
}

export default function AddEdgeForm({ className }: IProps) {
  const { sourceNode, targetNode, addEdge, setSheetOpen } = useGraph();

  const form = useForm<EdgeFormSchemaData>({
    resolver: zodResolver(EdgeFormSchema),
    defaultValues: EdgeFormSchemaDefaultValue,
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'conditions',
  });

  function onSubmit(data: EdgeFormSchemaData) {
    console.log('data >> ', data);

    addEdge(data);
    form.reset();
    //
    setSheetOpen(false);
    toast.success('Added edge successfully');
  }

  useEffect(() => {
    if (sourceNode) {
      form.setValue('source_node', sourceNode.id);
    }
    //
    if (targetNode) {
      form.setValue('target_node', targetNode.id);
    }
  }, [sourceNode, targetNode]);

  return (
    <EdgeForm
      form={form}
      fieldArray={fieldArray}
      onSubmit={onSubmit}
      className={className}
    />
  );
}
