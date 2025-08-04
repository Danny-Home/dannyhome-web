'use client';

import { ActiveThemeProvider } from '@/components/active-theme';
import { useTheme } from 'next-themes';
import React from 'react';

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        {children}
      </ActiveThemeProvider>
    </>
  );
}
