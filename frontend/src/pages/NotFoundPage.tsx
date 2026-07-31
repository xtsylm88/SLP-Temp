// frontend/src/pages/NotFoundPage.tsx

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        p: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 5,
          textAlign: 'center',
          maxWidth: 480,
          borderRadius: 4,
        }}
      >
        <FindInPageIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          404 — Halaman Tidak Ditemukan
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Halaman yang Anda cari tidak tersedia atau alamat URL yang Anda masukkan salah.
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => navigate('/')}>
          Kembali ke Halaman Utama
        </Button>
      </Paper>
    </Box>
  );
};
