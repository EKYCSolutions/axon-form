import { PageDataTable } from '@/components/PageDataTable.js';
import PageHeader from '@/components/form-builder-view/PageHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import type { Page } from '@/types/Page';
import { handleError, handleSuccess } from '@/utils/Toast';
import { Loader2 } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';

export default function FormPageList() {
  const navigate = useNavigate();
  const {
    pages,
    updatePageOrder,
    deletePage,
    exportForm,
    importForm,
    clearAllData,
  } = useFormBuilder();

  const [reOrderedPage, setReOrderedPage] = useState<Page[]>([]);
  const [isReordering, setIsReordering] = useState<boolean>(false);
  const [shouldResetOrder, setShouldResetOrder] = useState<boolean>(false);
  const [pendingImportData, setPendingImportData] = useState<unknown>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isLoadingJson, setIsLoadingJson] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLoadJsonClick = () => {
    if (isLoadingJson) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsConfirmOpen(true);
      setIsLoadingJson(true);
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      setPendingImportData(json);
    } catch (error) {
      handleError(error);
      setPendingImportData(null);
      setIsConfirmOpen(false);
    } finally {
      setIsLoadingJson(false);
      event.target.value = '';
    }
  };

  const handleLoadWithoutClearing = async () => {
    if (!pendingImportData) return;
    try {
      setIsLoadingJson(true);
      await importForm(pendingImportData);
      setPendingImportData(null);
      setIsConfirmOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingJson(false);
    }
  };

  const handleClearAndLoad = async () => {
    if (!pendingImportData) return;
    try {
      setIsLoadingJson(true);
      await clearAllData();
      await importForm(pendingImportData);
      setPendingImportData(null);
      setIsConfirmOpen(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingJson(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (isLoadingJson) return;
    setIsConfirmOpen(open);
    if (!open) {
      setPendingImportData(null);
    }
  };

  return (
    <FormBuilderViewLayout>
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
              <Button variant='outline' onClick={() => exportForm('form.json')}>
                Export to JSON
              </Button>
              <Button
                variant='outline'
                onClick={handleLoadJsonClick}
                disabled={isLoadingJson}
              >
                Load JSON
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                accept='application/json'
                className='hidden'
                onChange={handleFileChange}
              />
              <Button
                variant='secondary'
                onClick={() => navigate('/page/create')}
              >
                Create New
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator />
      <AlertDialog open={isConfirmOpen} onOpenChange={handleDialogOpenChange}>
        <AlertDialogContent>
          {isLoadingJson ? (
            <div className='flex flex-col items-center justify-center py-6 gap-3'>
              <Loader2 className='animate-spin size-6' />
              <p className='text-sm text-muted-foreground'>Loading JSON...</p>
            </div>
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Load JSON</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to clear existing PocketBase data before loading
                  this form?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={(event) => {
                    event.preventDefault();
                    void handleLoadWithoutClearing();
                  }}
                >
                  Keep Existing
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    void handleClearAndLoad();
                  }}
                >
                  Clear & Load
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
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
    </FormBuilderViewLayout>
  );
}
