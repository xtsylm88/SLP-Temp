// frontend/src/pages/AdminPlaceholderPage.tsx

import React from 'react';
import { Card, CardContent, Typography, Alert, Box, Button, Chip } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PageContainer } from '../components/PageContainer';
import { useAuth } from '../hooks/useAuth';

interface Props {
  title: string;
  subtitle?: string;
}

export const AdminPlaceholderPage: React.FC<Props> = ({
  title,
  subtitle,
}) => {
  const { user, logout } = useAuth();

  return (
    <PageContainer
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: title },
      ]}
    >
      <Card sx={{ mt: 2, borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '18px',
                  bgcolor: 'rgba(79, 70, 229, 0.1)',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {title}
                  </Typography>
                  {user && (
                    <Chip label={user.role} color="primary" size="small" sx={{ fontWeight: 700, borderRadius: '8px' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {subtitle || 'Modul administrasi dalam penyiapan sistem.'}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => logout()}
              sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}
            >
              Keluar (Logout)
            </Button>
          </Box>

          {user && (
            <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
                Informasi Sesi Login Administrator Active:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, fontSize: '0.875rem', color: '#475569' }}>
                <div><strong>Nama:</strong> {user.name}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Role:</strong> {user.role}</div>
                <div><strong>Status Session:</strong> Terautentikasi (httpOnly Cookie JWT)</div>
              </Box>
            </Box>
          )}

          <Alert
            severity="success"
            icon={<CheckCircleIcon fontSize="inherit" />}
            sx={{ borderRadius: '16px', fontWeight: 500 }}
          >
            Autentikasi Google OAuth & Protected Admin Route berjalan end-to-end! Dashboard Admin lengkap akan dibangun pada Sprint 6.
          </Alert>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
