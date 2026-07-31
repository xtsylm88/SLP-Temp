// frontend/src/components/Sidebar.tsx

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DRAWER_WIDTH = 280;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useApp();

  const navItems = [
    { label: 'Dashboard Admin', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Master Jenis Layanan', path: '/admin/jenis-layanan', icon: <CategoryIcon /> },
    { label: 'Daftar Permohonan', path: '/admin/permohonan', icon: <AssignmentIcon /> },
    { label: 'Pengaturan Sistem', path: '/admin/settings', icon: <SettingsIcon /> },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: '73px',
          height: 'calc(100% - 73px)',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 800,
            letterSpacing: '0.08em',
            display: 'block',
            mb: 2,
            px: 1,
          }}
        >
          NAVIGATION MENU
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={selected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '16px',
                    py: 1.2,
                    px: 2,
                    color: selected ? '#4f46e5' : '#475569',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(79, 70, 229, 0.08)',
                      color: '#4f46e5',
                      fontWeight: 700,
                      '& .MuiListItemIcon-root': {
                        color: '#4f46e5',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(241, 245, 249, 0.8)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: selected ? '#4f46e5' : '#64748b' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: selected ? 700 : 500 }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/')}
              sx={{
                borderRadius: '16px',
                py: 1.2,
                px: 2,
                color: '#64748b',
                '&:hover': {
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: '#64748b' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    Halaman Utama Public
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Admin User Footer Specimen */}
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: '16px',
            bgcolor: '#f8fafc',
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'rgba(79, 70, 229, 0.15)',
              color: '#4f46e5',
              fontWeight: 700,
              fontSize: '0.875rem',
            }}
          >
            AD
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#0f172a' }}>
              Admin Utama
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#64748b', display: 'block' }}>
              admin@pendampingan.go.id
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
