// frontend/src/pages/LoginPage.tsx
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { authService } from '../services/auth.service';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('error');

  const getErrorMessage = (code: string | null): string | null => {
    if (!code) return null;
    switch (code) {
      case 'ADMIN_NOT_FOUND':
        return 'Email Google Anda belum terdaftar sebagai administrator sistem pendampingan.';
      case 'ADMIN_INACTIVE':
        return 'Akun administrator Anda dalam status non-aktif. Silakan hubungi Super Admin.';
      case 'INVALID_OAUTH_STATE':
        return 'Sesi autentikasi telah berakhir atau terjadi masalah keamanan (state mismatch). Silakan coba lagi.';
      default:
        return 'Gagal melakukan login administrator. Silakan coba lagi.';
    }
  };

  const errorMessage = getErrorMessage(errorCode);

  const handleGoogleLogin = () => {
    authService.login();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header Logo & Title */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: '#4f46e5',
                color: '#ffffff',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 10px 20px rgba(79, 70, 229, 0.35)',
              }}
            >
              <ShieldIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Portal Administrator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Layanan Pendampingan Hukum & Administrasi
            </Typography>
          </Box>

          {/* Error Alert jika Login Ditolak */}
          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '16px',
                '& .MuiAlert-message': { fontSize: '0.875rem' },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Akses Ditolak
              </Typography>
              {errorMessage}
            </Alert>
          )}

          {/* Info Box */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.15)',
              borderRadius: '16px',
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
            }}
          >
            <InfoIcon sx={{ color: '#4f46e5', fontSize: 20, mt: 0.2, flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: '#334155', lineHeight: 1.5, display: 'block' }}>
              Akses portal ini khusus untuk Admin terdaftar. Autentikasi menggunakan Google OAuth dan diverifikasi terhadap basis data administrator.
            </Typography>
          </Box>

          {/* Action Button: Google Login */}
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={handleGoogleLogin}
            startIcon={
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.3-.8-.5-1.7-.5-2.6z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
            }
            sx={{
              py: 1.5,
              borderRadius: '14px',
              bgcolor: '#0f172a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
              '&:hover': {
                bgcolor: '#1e293b',
                boxShadow: '0 6px 16px rgba(15, 23, 42, 0.35)',
              },
            }}
          >
            Login dengan Google
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* Feature Checkpoints */}
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Terintegrasi Google OAuth 2.0
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Keamanan httpOnly Cookie & JWT Session
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Audit Logging Aktivitas Admin
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
