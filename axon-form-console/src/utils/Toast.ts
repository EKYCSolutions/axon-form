import { toast } from 'sonner';

//
export const handleError = (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : 'An unknown error occurred';
  toast.error(errorMessage);
};

//
export const handleSuccess = (message: string) => {
  toast.success(message);
};
