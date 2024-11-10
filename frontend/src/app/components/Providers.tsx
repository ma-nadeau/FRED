'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';

const theme = createTheme({
  // your theme options
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <NavigationWrapper>{children}</NavigationWrapper>
      </Box>
    </ThemeProvider>
  );
}
