import {
  ConditionGroupFormSchema,
  type ConditionGroupFormSchemaData,
} from '@/validations/ConditionGroupValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ConditionGroupForm from './ConditionGroupForm';

export default function AddConditionGroupForm() {
  const form = useForm<ConditionGroupFormSchemaData>({
    resolver: zodResolver(ConditionGroupFormSchema),
  });

  function onSubmit(data: ConditionGroupFormSchemaData) {
    console.log('data >> ', data);
  }

  return <ConditionGroupForm form={form} onSubmit={onSubmit} />;
}
