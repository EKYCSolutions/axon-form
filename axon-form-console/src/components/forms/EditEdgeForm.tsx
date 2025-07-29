import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  convertGraphEdgeToEdgeForm,
  EdgeFormSchema,
  type EdgeFormSchemaData,
} from '@/validations/EdgeValidation.js';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph.js';
import EdgeForm from './EdgeForm.js';

interface IProps {
  className?: string;
}

export default function EditEdgeForm({ className }: IProps) {
  const {
    selectedEdge,
    updateEdge,
    setSheetOpen,
    setIsEdgeMode,
    setSourceNode,
    setTargetNode,
  } = useGraph();

  if (!selectedEdge) {
    return;
  }

  const form = useForm<EdgeFormSchemaData>({
    resolver: zodResolver(EdgeFormSchema),
    defaultValues: convertGraphEdgeToEdgeForm(selectedEdge),
  });

  function onSubmit(data: EdgeFormSchemaData) {
    if (!selectedEdge?.id) {
      return;
    }
    //
    updateEdge(selectedEdge?.id, data);
    //
    setSheetOpen(false);
    toast.success('Update node successfully');
  }

  return <EdgeForm form={form} onSubmit={onSubmit} className={className} />;
}
