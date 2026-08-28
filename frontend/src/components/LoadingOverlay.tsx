// frontend/src/components/LoadingOverlay.tsx

import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  open,
  message = 'Sedang memproses permintaan Anda, mohon tunggu sebentar...',
}) => {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#ffffff',
        zIndex: (theme) => theme.zIndex.drawer + 200,
        bgcolor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 4,
          borderRadius: '20px',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <CircularProgress color="inherit" size={48} thickness={4} />
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#ffffff' }}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};
