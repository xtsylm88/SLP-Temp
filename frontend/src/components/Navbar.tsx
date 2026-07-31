// frontend/src/components/Navbar.tsx

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, userRole, setUserRole } = useApp();

  const isAdminView = location.pathname.startsWith('/admin');

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ height: 72, px: { xs: 2, md: 4 } }}>
        {isAdminView && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: 'primary.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            }}
          >
            S
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'text.primary',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                fontSize: '1.1rem',
              }}
            >
              Sistem Layanan <span style={{ color: '#4f46e5' }}>Pendampingan</span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Base Platform Digital
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={userRole === 'ADMIN' ? 'Admin Mode' : 'Public View'}
            color={userRole === 'ADMIN' ? 'primary' : 'default'}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: '0.75rem',
              px: 1,
              bgcolor: userRole === 'ADMIN' ? 'rgba(79, 70, 229, 0.1)' : '#f1f5f9',
              color: userRole === 'ADMIN' ? 'primary.main' : 'text.secondary',
              border: 'none',
            }}
          />

          {!isAdminView ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => {
                setUserRole('ADMIN');
                navigate('/admin');
              }}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Portal Admin
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setUserRole('PUBLIC');
                navigate('/');
              }}
              sx={{ borderRadius: '12px', fontWeight: 600 }}
            >
              Beranda Public
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
