import {
  ConditionGroupFormSchema,
  ConditionGroupFormSchemaDefaultValue,
  type ConditionGroupFormSchemaData,
} from '@/validations/ConditionGroupValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useGraph } from '../hooks/useGraph';
import ConditionGroupForm from './ConditionGroupForm';

export default function AddConditionGroupForm() {
  const form = useForm<ConditionGroupFormSchemaData>({
    resolver: zodResolver(ConditionGroupFormSchema),
    reValidateMode: 'onChange',
    defaultValues: ConditionGroupFormSchemaDefaultValue,
  });

  const { addConditionGroup, setSheetOpen, setSelectedNode } = useGraph();

  function onSubmit(data: ConditionGroupFormSchemaData) {
    addConditionGroup(data);

    form.reset();
    setSheetOpen(false);
    setSelectedNode(undefined);
    toast.success('Added group condition successfully');
  }

  return <ConditionGroupForm form={form} onSubmit={onSubmit} />;
}
