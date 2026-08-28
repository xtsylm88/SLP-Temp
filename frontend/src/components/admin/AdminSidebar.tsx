// frontend/src/components/admin/AdminSidebar.tsx
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
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 280;

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Master Jenis Layanan', path: '/admin/jenis-layanan', icon: <CategoryIcon /> },
    { label: 'Daftar Permohonan', path: '/admin/permohonan', icon: <AssignmentIcon /> },
    { label: 'Audit Log', path: '/admin/audit-log', icon: <HistoryIcon /> },
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
          ADMIN MENU
        </Typography>

        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {navItems.map((item) => {
            const selected = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={selected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '12px',
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
                borderRadius: '12px',
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
                    Halaman Publik
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Admin User Card */}
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: '12px',
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
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#0f172a' }}>
              {user?.name || 'Administrator'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: '#64748b', display: 'block' }}>
              {user?.email || 'admin@pendampingan.go.id'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
