import PageHeader from '@/components/form-builder-view/PageHeader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { useNavigate } from 'react-router';

export default function FormPageList() {
  const navigate = useNavigate();

  return (
    <FormBuilderViewLayout>
      <div className='flex justify-between items-center my-8 gap-4'>
        <PageHeader title='Pages' />
        <Button variant='secondary' onClick={() => navigate('/page/create')}>
          Create New
        </Button>
      </div>
      <Separator />
    </FormBuilderViewLayout>
  );
}
