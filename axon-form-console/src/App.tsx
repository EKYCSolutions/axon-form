import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/ThemeProvider';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import CreateForm from './pages/CreateForm.js';
import CreatePageForm from './pages/CreatePageForm';
import FormDetail from './pages/FormDetail.js';
import FormList from './pages/FormList.js';
import PageConditionForm from './pages/PageConditionForm.js';
import PageDetail from './pages/PageDetail';
import { FormBuilderProvider } from './providers/FormBuilderProvider';
import { GraphViewProvider } from './providers/GraphViewProvider';

export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <FormList />,
    },
    {
      path: '/form/create',
      element: <CreateForm />,
    },
    {
      path: '/form/:id',
      element: <FormDetail />,
    },
    {
      path: '/form/:id/page/create',
      element: <CreatePageForm />,
    },
    {
      path: '/form/:id/page/:pageId',
      element: <PageDetail />,
    },
    {
      path: '/form/:id/page/:pageId/condition',
      element: <PageConditionForm />,
    },
    { path: '*', element: <Navigate to='/' replace /> },
  ]);

  return (
    <div className='w-dvw h-dvh'>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <GraphViewProvider>
            <FormBuilderProvider>
              <RouterProvider router={router} />
            </FormBuilderProvider>
          </GraphViewProvider>
        </QueryClientProvider>
      </ThemeProvider>
      <Toaster richColors />
    </div>
  );
}
