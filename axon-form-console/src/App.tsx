import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/ThemeProvider';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import type { ReactNode } from 'react';
import CreateForm from './pages/CreateForm.js';
import CreatePageForm from './pages/CreatePageForm';
import FormDetail from './pages/FormDetail.js';
import FormList from './pages/FormList.js';
import Login from './pages/Login';
import PageConditionForm from './pages/PageConditionForm.js';
import PageDetail from './pages/PageDetail';
import { FormBuilderProvider } from './providers/FormBuilderProvider';
import { GraphViewProvider } from './providers/GraphViewProvider';
import { isSuperuserAuthenticated } from './services/PocketBaseService';

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isSuperuserAuthenticated()) {
    return <Navigate to='/login' replace />;
  }
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  if (isSuperuserAuthenticated()) {
    return <Navigate to='/' replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: '/login',
      element: (
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <FormList />
        </ProtectedRoute>
      ),
    },
    {
      path: '/form/create',
      element: (
        <ProtectedRoute>
          <CreateForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '/form/:id',
      element: (
        <ProtectedRoute>
          <FormDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: '/form/:id/page/create',
      element: (
        <ProtectedRoute>
          <CreatePageForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '/form/:id/page/:pageId',
      element: (
        <ProtectedRoute>
          <PageDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: '/form/:id/page/:pageId/condition',
      element: (
        <ProtectedRoute>
          <PageConditionForm />
        </ProtectedRoute>
      ),
    },
    {
      path: '*',
      element: <Navigate to={isSuperuserAuthenticated() ? '/' : '/login'} replace />,
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
