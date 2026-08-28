// frontend/src/components/RequestSuccess.tsx

import React, { useState } from 'react';
import { Paper, Typography, Box, Button, Chip, Alert, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

interface RequestSuccessProps {
  requestId: string;
  status?: string;
  createdAt?: string;
}

export const RequestSuccess: React.FC<RequestSuccessProps> = ({ requestId, status = 'SUBMITTED', createdAt }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        textAlign: 'center',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        maxWidth: 640,
        mx: 'auto',
        mt: 4,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 56 }} />
      </Box>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
        Permohonan Berhasil Dikirim!
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
        Terima kasih. Permohonan pendampingan Anda telah masuk ke sistem dan akan diproses oleh verifikator.
      </Typography>

      {/* Request ID Display Box */}
      <Box
        sx={{
          p: 3,
          bgcolor: '#f8fafc',
          borderRadius: '16px',
          border: '2px dashed #cbd5e1',
          mb: 4,
          position: 'relative',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', tracking: 1, mb: 1, display: 'block' }}>
          Nomor Permohonan Anda (Request ID)
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: '0.05em',
            fontFamily: 'monospace',
            my: 1,
            fontSize: { xs: '1.75rem', sm: '2.5rem' },
          }}
        >
          {requestId}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
          >
            {copied ? 'Tersalin ke Clipboard!' : 'Salin Request ID'}
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 4, textAling: 'left', borderRadius: '12px' }}>
        Simpan dan catat Request ID ini. Anda dapat menggunakannya sewaktu-waktu untuk memeriksa status perkembangan permohonan melalui halaman Cek Status.
      </Alert>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SearchIcon />}
          onClick={() => navigate(`/status?id=${requestId}`)}
          sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}
        >
          Cek Status Permohonan
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}
        >
          Kembali ke Beranda
        </Button>
      </Stack>
    </Paper>
  );
};
