// frontend/src/components/ServiceList.tsx

import React from 'react';
import { Grid, Skeleton, Card, CardContent, Box } from '@mui/material';
import { ServiceCard } from './ServiceCard';
import { ErrorState } from './ErrorState';
import { useJenisLayanan } from '../hooks/useJenisLayanan';

export const ServiceList: React.FC = () => {
  const { data: services, loading, error, retry } = useJenisLayanan();

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: '12px' }} />
                  <Skeleton variant="rounded" width={60} height={24} />
                </Box>
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={42} sx={{ mt: 3, borderRadius: '12px' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal Memuat Daftar Layanan"
        message={error.message || 'Terjadi masalah saat mengambil master jenis layanan dari server.'}
        onRetry={retry}
      />
    );
  }

  if (!services || services.length === 0) {
    return (
      <ErrorState
        title="Belum Ada Layanan Tersedia"
        message="Saat ini belum ada jenis layanan aktif yang dikonfigurasi di master data."
        onRetry={retry}
      />
    );
  }

  return (
    <Grid container spacing={3}>
      {services.map((service) => (
        <Grid key={service.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ServiceCard service={service} />
        </Grid>
      ))}
    </Grid>
  );
};
