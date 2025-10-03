import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/ThemeProvider';

import { createBrowserRouter, RouterProvider } from 'react-router';
import CreatePageForm from './pages/CreatePageForm';
import MainPage from './pages/MainPage';
import PageDetail from './pages/PageDetail';
import { FormBuilderProvider } from './providers/FormBuilderProvider';
import { GraphViewProvider } from './providers/GraphviewProvider';

export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
    },
    {
      path: '/page/create',
      element: <CreatePageForm />,
    },
    {
      path: '/page/:id',
      element: <PageDetail />,
    },
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
