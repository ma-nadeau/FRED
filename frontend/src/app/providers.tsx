'use client';

import ThemeProvider from '../lib/ThemeProvider';
import NavigationWrapper from './components/NavigationWrapper';
import { Box, CssBaseline } from '@mui/material';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <NavigationWrapper>{children}</NavigationWrapper>
    </ThemeProvider>
  );
} 