// frontend/src/layouts/PublicLayout.tsx

import React from 'react';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';

export const PublicLayout: React.FC = () => {
  const { notification, hideNotification } = useApp();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F3F6FB' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          bgcolor: '#FFFFFF',
          borderTop: '1px solid #C8D2E3',
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ color: '#4F5D75', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Sistem Layanan Pendampingan Digital BPMP Provinsi Sumatera Selatan. Hak cipta dilindungi undang-undang.
          </Typography>
          <Typography
            variant="caption"
            align="center"
            sx={{
              display: 'block',
              color: '#4F5D75',
              mt: 0.5,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.725rem',
            }}
          >
            Google Cloud Run • Express Gateway • Apps Script Data Core
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
          <Alert
            onClose={hideNotification}
            severity={notification.type}
            sx={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #C8D2E3',
              boxShadow: '0 2px 8px rgba(10, 46, 115, 0.08)',
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

