// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { AppProvider } from './context/AppContext';
import { AppRoutes } from './routes/AppRoutes';
import { AppGuard } from './components/AppGuard';

export default function App() {
  return (
    <AppGuard>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </AppGuard>
  );
}
