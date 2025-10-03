import { PageDataTable } from '@/components/PageDataTable.js';
import PageHeader from '@/components/form-builder-view/PageHeader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { useNavigate } from 'react-router';

export default function FormPageList() {
  const navigate = useNavigate();
  const { pages } = useFormBuilder();

  return (
    <FormBuilderViewLayout>
      <div className='flex justify-between items-center my-8 gap-4'>
        <PageHeader title='Pages' />
        <Button variant='secondary' onClick={() => navigate('/page/create')}>
          Create New
        </Button>
      </div>
      <Separator />
      {pages.length > 0 ? (
        <PageDataTable pages={pages} />
      ) : (
        <div className='flex items-center justify-center p-8'>
          <p>No pages available</p>
        </div>
      )}
    </FormBuilderViewLayout>
  );
}
