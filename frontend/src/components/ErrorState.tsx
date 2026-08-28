// frontend/src/components/ErrorState.tsx

import React from 'react';
import { Paper, Typography, Box, Button, Alert, Collapse } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import { ApiError } from '../services/api';

interface ErrorStateProps {
  error?: ApiError | Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, title, message, onRetry }) => {
  const isApiError = error instanceof ApiError;
  const isNetworkOrTimeout = isApiError ? error.isNetworkOrTimeout : false;
  const traceId = isApiError ? error.traceId : undefined;

  const displayTitle = title || (isNetworkOrTimeout ? 'Status Koneksi / Komunikasi Belum Dipastikan' : 'Terjadi Kesalahan');
  const displayMessage =
    message ||
    error?.message ||
    'Terjadi kendala teknis saat memproses permintaan Anda. Silakan coba beberapa saat lagi.';

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: '20px',
        border: '1px solid #fecaca',
        bgcolor: '#fef2f2',
        textAlign: 'center',
        maxWidth: 560,
        mx: 'auto',
        my: 3,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: '#fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        {isNetworkOrTimeout ? <SignalWifiOffIcon fontSize="large" /> : <ErrorIcon fontSize="large" />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 800, color: '#991b1b', mb: 1 }}>
        {displayTitle}
      </Typography>

      <Typography variant="body2" sx={{ color: '#7f1d1d', mb: 3, lineHeight: 1.6 }}>
        {displayMessage}
      </Typography>

      {/* Pesan edukatif jika terjadi timeout / koneksi */}
      {isNetworkOrTimeout && (
        <Alert severity="warning" sx={{ mb: 3, textAlign: 'left', borderRadius: '12px', fontSize: '0.85rem' }}>
          <strong>Catatan Penting:</strong> Apabila Anda baru saja menekan tombol pengajuan, data permohonan Anda kemungkinan besar sudah berhasil masuk ke antrean Google Sheets. Mohon tidak melakukan submit berulang kali. Silakan periksa melalui halaman Cek Status atau kontak admin jika ragu.
        </Alert>
      )}

      {traceId && (
        <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: '8px', border: '1px solid #fca5a5', mb: 3 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#991b1b', fontWeight: 600 }}>
            Trace ID: {traceId}
          </Typography>
        </Box>
      )}

      {onRetry && (
        <Button
          variant="contained"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none', px: 3, py: 1 }}
        >
          Coba Lagi
        </Button>
      )}
    </Paper>
  );
};
