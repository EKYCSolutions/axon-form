import PageForm from '@/components/form-builder-view/PageForm';
import { NodeFieldType, NodeType, ValidationRuleType } from '@/configs/graph';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import {
  PageFormSchema,
  type PageFormSchemaData,
} from '@/validations/PageFormValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

export default function CreatePageForm() {
  const navigate = useNavigate();
  const { addPage } = useFormBuilder();

  const form = useForm<PageFormSchemaData>({
    resolver: zodResolver(PageFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: 'test pb hook',
      description: 'description',
      fields: [
        {
          id: crypto.randomUUID(),
          type: NodeType.Input,
          field_type: NodeFieldType.Text,
          field_name: 'field-with-condition',
          label: 'Field Label with Condition',
          placeholder: 'field with condition placeholder',
          validation_rules: [],
        },
        {
          id: crypto.randomUUID(),
          type: NodeType.Input,
          field_type: NodeFieldType.Text,
          field_name: 'field-name',
          label: 'Field Label',
          placeholder: 'placeholder',
          validation_rules: [
            {
              type: ValidationRuleType.MaxLength,
              value: 10,
              message: 'Max length is 10',
            },
          ],
        },
        {
          id: crypto.randomUUID(),
          type: NodeType.Input,
          field_type: NodeFieldType.Radio,
          field_name: 'field-name-select',
          label: 'Field Label Select',
          placeholder: 'placeholder select',
          select_options: [
            {
              label: 'Option 1',
              value: 'option-1',
            },
            {
              label: 'Option 2',
              value: 'option-2',
            },
            {
              label: 'Option 3',
              value: 'option-3',
            },
          ],
          validation_rules: [
            {
              type: ValidationRuleType.Required,
              message: 'This field is required',
            },
          ],
        },
      ],
    },
  });

  function onSubmit(data: PageFormSchemaData) {
    addPage(data);
    //
    form.reset();
    navigate('/page', {});
  }

  return <PageForm form={form} onSubmit={onSubmit} />;
}
