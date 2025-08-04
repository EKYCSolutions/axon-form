import {
  ConditionGroupFormSchema,
  ConditionGroupFormSchemaDefaultValue,
  type ConditionGroupFormSchemaData,
} from '@/validations/ConditionGroupValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useGraph } from '../hooks/useGraph';
import ConditionGroupForm from './ConditionGroupForm';

export default function AddConditionGroupForm() {
  const form = useForm<ConditionGroupFormSchemaData>({
    resolver: zodResolver(ConditionGroupFormSchema),
    reValidateMode: 'onChange',
    defaultValues: ConditionGroupFormSchemaDefaultValue,
  });

  const { addConditionGroup } = useGraph();

  function onSubmit(data: ConditionGroupFormSchemaData) {
    console.log('data >> ', data);

    addConditionGroup(data);

    // const conditionString = convertConditionGroupToConditionString(data);
    // console.log('condition string >>', conditionString);
    // const conditionGroupObject =
    //   convertConditionStringToConditionGroupObject(conditionString);
    // console.log('condition group object >>', conditionGroupObject);
  }

  return <ConditionGroupForm form={form} onSubmit={onSubmit} />;
}
