// frontend/src/components/admin/LoadingState.tsx
import React from 'react';
import { Box, Paper, Skeleton, Stack, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  variant?: 'skeleton' | 'circular' | 'spinner';
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat data...',
  variant = 'skeleton',
  count = 5,
}) => {
  if (variant === 'circular' || variant === 'spinner') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          gap: 2,
        }}
      >
        <CircularProgress size={40} sx={{ color: '#4f46e5' }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
      }}
    >
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '8px' }} />
        {Array.from({ length: count }).map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" height={52} sx={{ borderRadius: '8px' }} />
        ))}
      </Stack>
    </Paper>
  );
};
