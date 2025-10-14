import type { MouseEventHandler } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface IProps {
  children: React.ReactNode;
  //
  title: string;
  description: string;
  //
  cancelText?: string;
  continueText?: string;
  //
  onCancelClick?: MouseEventHandler<HTMLButtonElement>;
  onContinueClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function CustomAlertDialog({
  children,
  title,
  description,
  //
  cancelText = 'Cancel',
  continueText = 'Continue',
  //
  onCancelClick,
  onContinueClick,
}: IProps) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancelClick}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onContinueClick}>
              {continueText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
