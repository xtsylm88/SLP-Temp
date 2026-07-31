// frontend/src/components/Loading.tsx

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Memuat data...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: 2,
      }}
    >
      <CircularProgress color="primary" size={48} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
};
