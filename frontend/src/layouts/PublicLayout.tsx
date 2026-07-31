// frontend/src/layouts/PublicLayout.tsx

import React from 'react';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';

export const PublicLayout: React.FC = () => {
  const { notification, hideNotification } = useApp();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          bgcolor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} Sistem Layanan Pendampingan Berbasis Digital. All rights reserved.
          </Typography>
          <Typography variant="caption" align="center" sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}>
            Powered by Google Cloud Run, Express & Google Workspace Integration.
          </Typography>
        </Container>
      </Box>

      {notification && (
        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={6000}
          onClose={hideNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={hideNotification} severity={notification.type} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
