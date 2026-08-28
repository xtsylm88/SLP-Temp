// frontend/src/components/admin/ErrorState.tsx
import React from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kesalahan saat berkomunikasi dengan server. Silakan coba lagi.',
  onRetry,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        textAlign: 'center',
        borderRadius: '16px',
        border: '1px solid #fee2e2',
        bgcolor: '#fef2f2',
        maxWidth: 550,
        mx: 'auto',
        my: 4,
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          bgcolor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          mb: 2,
        }}
      >
        <ErrorIcon sx={{ fontSize: 44 }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 800, color: '#991b1b', mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: '#7f1d1d', mb: 3, lineHeight: 1.6 }}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            px: 3,
            py: 1,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              bgcolor: '#dc2626',
            },
          }}
        >
          Coba Lagi
        </Button>
      )}
    </Paper>
  );
};
