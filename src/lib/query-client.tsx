'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Disable auto refetch on focus to avoid unwanted API calls
            refetchOnReconnect: 'always', // Always refetch when reconnecting
            staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
            gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes (was cacheTime)
            retry: (failureCount, error: any) => {
              if (
                error?.message?.includes('404') ||
                error?.message?.includes('403')
              ) {
                return false; // Don't retry for 404 or 403 errors
              }
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000) // Exponential backoff
          },
          mutations: {
            retry: (failureCount, error: any) => {
              if (
                error?.message?.includes('404') ||
                error?.message?.includes('403')
              ) {
                return false;
              }
              return failureCount < 2;
            }
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
