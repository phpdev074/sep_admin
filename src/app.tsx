import 'src/global.css';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

// ----------------------------------------------------------------------

const queryClient = new QueryClient()

export default function App() {
  useScrollToTop();


  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
    </QueryClientProvider>
  );
}
