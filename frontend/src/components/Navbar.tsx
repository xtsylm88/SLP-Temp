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
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddTaskIcon from '@mui/icons-material/AddTask';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
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
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #C8D2E3',
      }}
    >
      <Toolbar sx={{ height: 64, px: { xs: 2, md: 4 } }}>
        {isAdminView && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2, color: '#4F5D75' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexGrow: { xs: 1, md: 0 },
            mr: { md: 4 },
          }}
        >
          <Box
            component="img"
            src="https://i.postimg.cc/X7TB6pRf/Chat-GPT-Image-Aug-7-2026-10-25-50-AM.png"
            alt="Logo BPMP Sumsel"
            referrerPolicy="no-referrer"
            sx={{
              width: 40,
              height: 40,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
        </Box>

        {/* Public Nav Menu Items */}
        {!isAdminView && (
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            <Button
              startIcon={<HomeIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/')}
              sx={{
                color: location.pathname === '/' ? '#1249B8' : '#4F5D75',
                fontWeight: location.pathname === '/' ? 700 : 500,
                borderRadius: '6px',
                textTransform: 'none',
                backgroundColor: location.pathname === '/' ? '#EBF2FF' : 'transparent',
                '&:hover': {
                  backgroundColor: '#EBF2FF',
                },
              }}
            >
              Beranda
            </Button>
            <Button
              startIcon={<AddTaskIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/pengajuan')}
              sx={{
                color: location.pathname === '/pengajuan' ? '#1249B8' : '#4F5D75',
                fontWeight: location.pathname === '/pengajuan' ? 700 : 500,
                borderRadius: '6px',
                textTransform: 'none',
                backgroundColor: location.pathname === '/pengajuan' ? '#EBF2FF' : 'transparent',
                '&:hover': {
                  backgroundColor: '#EBF2FF',
                },
              }}
            >
              Ajukan Permohonan
            </Button>
            <Button
              startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
              onClick={() => navigate('/status')}
              sx={{
                color: location.pathname === '/status' ? '#1249B8' : '#4F5D75',
                fontWeight: location.pathname === '/status' ? 700 : 500,
                borderRadius: '6px',
                textTransform: 'none',
                backgroundColor: location.pathname === '/status' ? '#EBF2FF' : 'transparent',
                '&:hover': {
                  backgroundColor: '#EBF2FF',
                },
              }}
            >
              Cek Status
            </Button>
          </Stack>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
          <Chip
            label={userRole === 'ADMIN' ? 'Admin Mode' : 'Public View'}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.65rem',
              px: 0.5,
              bgcolor: userRole === 'ADMIN' ? '#EBF2FF' : '#F3F6FB',
              color: userRole === 'ADMIN' ? '#1249B8' : '#4F5D75',
              border: '1px solid #C8D2E3',
            }}
          />

          {!isAdminView ? (
            <Button
              variant="contained"
              size="small"
              startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                setUserRole('ADMIN');
                navigate('/admin');
              }}
              sx={{
                borderRadius: '6px',
                fontWeight: 600,
                textTransform: 'none',
                bgcolor: '#1249B8',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#0A2E73' },
              }}
            >
              Portal Admin
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              onClick={() => {
                setUserRole('PUBLIC');
                navigate('/');
              }}
              sx={{
                borderRadius: '6px',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: '#C8D2E3',
                color: '#1249B8',
                '&:hover': { borderColor: '#1249B8', bgcolor: '#EBF2FF' },
              }}
            >
              Beranda Public
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

