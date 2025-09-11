'use client';

import { lightTheme } from './theme';
import { ThemeProvider } from '@emotion/react';
import { GlobalStyles } from './styles';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
