import CustomAlertDialog from '@/components/CustomAlertDialog';
import Header from '@/components/form-builder-view/Header';
import {
  AlertDialog,
  AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFormBuilder } from '@/hooks/useFormBuilder';
import FormBuilderViewLayout from '@/layouts/FormBuilderViewLayout';
import { formatDateTime } from '@/utils/Datetime';
import { handleError } from '@/utils/Toast';
import { Loader2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router';

export default function FormList() {
  const navigate = useNavigate();
  const { forms, deleteForm, exportForm, importForm } = useFormBuilder();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormId, setExportFormId] = useState<string | null>(null);
  const [exportFileName, setExportFileName] = useState('form');
  const [isImportingForm, setIsImportingForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onDelete(id: string) {
    deleteForm(id);
  }

  function openExportDialog(id: string) {
    setExportFormId(id);
    setExportFileName('form');
    setIsExportDialogOpen(true);
  }

  function handleExportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedFileName = exportFileName.trim();
    const normalizedFileName = trimmedFileName.endsWith('.json')
      ? trimmedFileName
      : `${trimmedFileName || 'form'}.json`;
    if (!exportFormId) return;
    exportForm(exportFormId, normalizedFileName);
    setIsExportDialogOpen(false);
    setExportFormId(null);
  }

  function handleImportFormClick() {
    if (isImportingForm) return;
    fileInputRef.current?.click();
  }

  async function handleImportFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImportingForm(true);
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      const createdFormId = await importForm(json);
      if (!createdFormId) {
        toast.error('Could not import form');
        return;
      }
      navigate(`/form/${createdFormId}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsImportingForm(false);
      event.target.value = '';
    }
  }

  return (
    <FormBuilderViewLayout>
      <div className='flex justify-between items-center my-8 gap-4'>
        <Header title='Forms' />
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={handleImportFormClick}
            disabled={isImportingForm}
          >
            {isImportingForm ? 'Importing...' : 'Import Form'}
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            accept='application/json'
            className='hidden'
            onChange={handleImportFileChange}
          />
          <Button variant='secondary' onClick={() => navigate('/form/create')}>
            Create New
          </Button>
        </div>
      </div>
      <Separator />
      {forms.length > 0 ? (
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              <TableRow>
                <TableHead className='pl-4'>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((data) => (
                <TableRow
                  key={data.id}
                  className='relative z-0 h-12 cursor-pointer'
                  onClick={() => navigate(`/form/${data.id}`)}
                >
                  <TableCell className='pl-4'>{data.title}</TableCell>
                  <TableCell className='whitespace-normal'>
                    {data.description}
                  </TableCell>
                  <TableCell
                    className='flex items-center justify-between'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatDateTime(data.updated_at)}
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                          size='icon'
                        >
                          <MoreVertical />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-36'>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            openExportDialog(data.id);
                          }}
                        >
                          Export form
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <CustomAlertDialog
                          title='Are you absolutely sure?'
                          description='This action cannot be undone. This will permanently delete this item and remove all associated data.'
                          continueText='Delete'
                          onContinueClick={() => onDelete(data.id)}
                        >
                          <DropdownMenuItem
                            variant='destructive'
                            onSelect={(e) => e.preventDefault()}
                          >
                            Delete
                          </DropdownMenuItem>
                        </CustomAlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='flex items-center justify-center p-8'>
          <p>No forms available</p>
        </div>
      )}
      <Dialog
        open={isExportDialogOpen}
        onOpenChange={(open) => {
          setIsExportDialogOpen(open);
          if (!open) {
            setExportFormId(null);
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleExportSubmit} className='space-y-4'>
            <DialogHeader>
              <DialogTitle>Export form</DialogTitle>
              <DialogDescription>
                Enter a filename for the exported JSON file.
              </DialogDescription>
            </DialogHeader>
            <ButtonGroup className='w-full'>
              <Input
                value={exportFileName}
                onChange={(event) => setExportFileName(event.target.value)}
                placeholder='form'
                autoFocus
              />
              <Button disabled variant='outline'>
                .json
              </Button>
            </ButtonGroup>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsExportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Export</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isImportingForm}
        onOpenChange={(open) => {
          if (isImportingForm || open) return;
          setIsImportingForm(false);
        }}
      >
        <AlertDialogContent>
          <div className='flex flex-col items-center justify-center py-6 gap-3'>
            <Loader2 className='animate-spin size-6' />
            <p className='text-sm text-muted-foreground'>Loading JSON...</p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </FormBuilderViewLayout>
  );
}
