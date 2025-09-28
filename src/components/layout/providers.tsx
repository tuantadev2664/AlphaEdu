'use client';

import React from 'react';
import { ActiveThemeProvider } from '../active-theme';
import { QueryProvider } from '@/lib/query-client';
import { AuthProvider } from './auth-provider';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <QueryProvider>
        <ActiveThemeProvider initialTheme={activeThemeValue}>
          <AuthProvider>{children}</AuthProvider>
        </ActiveThemeProvider>
      </QueryProvider>
    </>
  );
}
