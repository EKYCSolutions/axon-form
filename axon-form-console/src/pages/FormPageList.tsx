import { PageDataTable } from '@/components/PageDataTable.js';
import PageHeader from '@/components/form-builder-view/PageHeader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import type { Page } from '@/types/Page';
import { handleSuccess } from '@/utils/Toast';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function FormPageList() {
  const navigate = useNavigate();
  const location = useLocation();
  //
  const { pages, updatePageOrder, deletePage } = useFormBuilder();

  const [reOrderedPage, setReOrderedPage] = useState<Page[]>([]);
  const [isReordering, setIsReordering] = useState<boolean>(false);
  const [shouldResetOrder, setShouldResetOrder] = useState<boolean>(false);

  const handleReordering = (status: boolean, pages: Page[]) => {
    setIsReordering(status);
    setReOrderedPage(pages);
  };

  const handleCancel = () => {
    setShouldResetOrder(true);
    //
    setTimeout(() => setShouldResetOrder(false), 0);
  };

  const handleSaveReorder = () => {
    updatePageOrder(reOrderedPage);
    handleSuccess('Reordered page successfully');
    setIsReordering(false);
  };

  const handleDelete = (id: string) => {
    deletePage(id);
  };

  return (
    <>
      <div className='flex justify-between items-center my-8 gap-4'>
        <PageHeader title='Pages' />
        <div className='flex gap-2'>
          {isReordering ? (
            <>
              <Button variant='outline' onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button variant='secondary' onClick={() => handleSaveReorder()}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='secondary'
                onClick={() => navigate(`${location.pathname}/page/create`)}
              >
                Create New
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator />
      {pages.length > 0 ? (
        <PageDataTable
          shouldResetOrder={shouldResetOrder}
          handleReordering={handleReordering}
          onDelete={handleDelete}
        />
      ) : (
        <div className='flex items-center justify-center p-8'>
          <p>No pages available</p>
        </div>
      )}
    </>
  );
}
