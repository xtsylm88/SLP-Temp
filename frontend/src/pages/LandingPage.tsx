// frontend/src/pages/LandingPage.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { apiClient } from '../services/apiClient';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [backendHealth, setBackendHealth] = useState<{
    status: string;
    environment?: string;
  } | null>(null);

  useEffect(() => {
    // Check backend connection health on mount
    apiClient
      .getHealth()
      .then((res) => {
        if (res.success && res.data) {
          setBackendHealth(res.data);
        }
      })
      .catch(() => setBackendHealth(null));
  }, []);

  return (
    <PageContainer>
      {/* Hero Banner Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          mb: 4,
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
        }}
      >
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: { xs: '1.875rem', md: '2.25rem' } }}
            >
              Sistem Layanan Pendampingan Berbasis Digital
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 600, mb: 3 }}>
              Platform terpadu untuk pengajuan dan pengelolaan permohonan pendampingan.
              Menyediakan akses mudah, transparan, dan terintegrasi untuk masyarakat.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/permohonan/baru')}
                startIcon={<SendIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#4338ca',
                  },
                }}
              >
                Ajukan Permohonan
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/permohonan/cek-status')}
                startIcon={<SearchIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Cek Status
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 800, letterSpacing: '0.08em' }}>
                  STATUS SERVER
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mt: 0.5 }}>
                  Layanan Online
                </Typography>
                {backendHealth ? (
                  <Alert
                    severity="success"
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    sx={{
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      color: '#6ee7b7',
                      borderRadius: '16px',
                      fontWeight: 600,
                      border: '1px solid rgba(110, 231, 183, 0.2)',
                    }}
                  >
                    Sistem Berjalan Normal ({backendHealth.status})
                  </Alert>
                ) : (
                  <Alert
                    severity="info"
                    sx={{
                      bgcolor: 'rgba(59, 130, 246, 0.15)',
                      color: '#93c5fd',
                      borderRadius: '16px',
                      fontWeight: 600,
                    }}
                  >
                    Menghubungkan ke Server...
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Informasi Layanan Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.01em' }}>
          Portal Layanan Publik
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Platform resmi pengajuan permohonan pendampingan digital.
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: '24px' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  Pengajuan Mudah
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prosedur pengajuan permohonan yang ringkas dengan verifikasi data yang aman.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: '24px' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  Pemantauan Transparan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cek status permohonan secara mandiri menggunakan kode unik pendaftaran.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', borderRadius: '24px' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  Terintegrasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Terkoneksi langsung dengan sistem verifikasi internal dan penyimpanan terpusat.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
