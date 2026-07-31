// frontend/src/pages/AdminPlaceholderPage.tsx

import React from 'react';
import { Card, CardContent, Typography, Alert, Box } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { PageContainer } from '../components/PageContainer';

interface Props {
  title: string;
  subtitle?: string;
}

export const AdminPlaceholderPage: React.FC<Props> = ({
  title,
  subtitle,
}) => {
  return (
    <PageContainer
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: 'Admin', href: '/admin' },
        { label: title },
      ]}
    >
      <Card sx={{ mt: 2, borderRadius: '24px' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2 }}>
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
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle || 'Modul administrasi dalam penyiapan sistem.'}
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2, borderRadius: '16px', fontWeight: 500 }}>
            Halaman administrasi {title} siap digunakan.
          </Alert>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

