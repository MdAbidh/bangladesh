'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';
import { MantineProvider } from '@mantine/core';
import { store } from '@/store/store';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <NextUIProvider>
          <MantineProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </MantineProvider>
        </NextUIProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
