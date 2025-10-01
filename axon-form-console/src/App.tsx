import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { GraphProvider } from './providers/GraphProvider';
import { ThemeProvider } from './providers/ThemeProvider';

import { createBrowserRouter, RouterProvider } from 'react-router';
import CreatePageForm from './pages/CreatePageForm';
import MainPage from './pages/MainPage';

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
  ]);

  return (
    <div className='w-dvw h-dvh'>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <QueryClientProvider client={queryClient}>
          <GraphProvider>
            <RouterProvider router={router} />
          </GraphProvider>
        </QueryClientProvider>
      </ThemeProvider>
      <Toaster richColors />
    </div>
  );
}
