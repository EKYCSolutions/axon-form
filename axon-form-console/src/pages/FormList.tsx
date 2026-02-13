import CustomAlertDialog from '@/components/CustomAlertDialog';
import Header from '@/components/form-builder-view/Header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function FormList() {
  const navigate = useNavigate();
  const { forms, deleteForm, exportForm } = useFormBuilder();

  function onDelete(id: string) {
    deleteForm(id);
  }

  return (
    <FormBuilderViewLayout>
      <div className='flex justify-between items-center my-8 gap-4'>
        <Header title='Forms' />
        <Button variant='secondary' onClick={() => navigate('/form/create')}>
          Create New
        </Button>
      </div>
      <Separator />
      {forms.length > 0 ? (
        <div className='overflow-hidden rounded-lg border'>
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              <TableRow>
                <TableHead className='pl-8'>Title</TableHead>
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
                  <TableCell className='pl-8'>{data.title}</TableCell>
                  <TableCell>{data.description}</TableCell>
                  <TableCell
                    className='flex items-center justify-between'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatDateTime(data.updated_at)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
                          size='icon'
                          onClick={(e) => e.preventDefault()}
                        >
                          <MoreVertical />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-36'>
                        <DropdownMenuItem
                          onClick={() => exportForm('form.json')}
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
    </FormBuilderViewLayout>
  );
}
