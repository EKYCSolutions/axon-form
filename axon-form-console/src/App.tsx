import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import MainPage from './pages/MainPage';
import { GraphProvider } from './providers/GraphProvider';
import { ThemeProvider } from './providers/ThemeProvider';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <div className='w-dvw h-dvh'>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <GraphProvider>
          <QueryClientProvider client={queryClient}>
            <MainPage />
          </QueryClientProvider>
        </GraphProvider>
      </ThemeProvider>
      <Toaster />
    </div>
  );
}
