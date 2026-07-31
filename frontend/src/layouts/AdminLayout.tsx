// frontend/src/layouts/AdminLayout.tsx

import React from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useApp } from '../context/AppContext';

export const AdminLayout: React.FC = () => {
  const { notification, hideNotification } = useApp();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            ml: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {notification && (
        <Snackbar
          open={Boolean(notification)}
          autoHideDuration={6000}
          onClose={hideNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={hideNotification} severity={notification.type} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};
