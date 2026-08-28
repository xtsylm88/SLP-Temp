// frontend/src/pages/StatusPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  InputBase,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyIcon from '@mui/icons-material/Key';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { StatusCard } from '../components/StatusCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorState } from '../components/ErrorState';
import { useStatusPermohonan } from '../hooks/useStatusPermohonan';

export const StatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlRequestId = searchParams.get('id') || '';

  const [inputReqId, setInputReqId] = useState<string>(urlRequestId);
  const [validationError, setValidationError] = useState<string>('');

  const { checkStatus, loading, error, data, reset } = useStatusPermohonan();

  // Otomatis trigger pencarian jika ada parameter `id` di URL
  useEffect(() => {
    if (urlRequestId) {
      setInputReqId(urlRequestId);
      const clean = urlRequestId.trim().toUpperCase();
      if (/^REQ-\d{4}-\d{6}$/i.test(clean)) {
        setValidationError('');
        checkStatus(clean);
      } else {
        setValidationError('Format Request ID tidak sesuai. Contoh yang benar: REQ-2026-000001');
      }
    }
  }, [urlRequestId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputReqId.trim().toUpperCase();

    if (!clean) {
      setValidationError('Silakan masukkan Request ID permohonan Anda.');
      return;
    }

    if (!/^REQ-\d{4}-\d{6}$/i.test(clean)) {
      setValidationError('Format Request ID tidak sesuai. Harus diawali "REQ-" disusul tahun dan 6 digit angka (misal: REQ-2026-000001).');
      return;
    }

    setValidationError('');
    navigate(`/status?id=${clean}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
      <LoadingOverlay open={loading} message="Mencari data permohonan di database..." />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '12px',
          border: '1px solid #C8D2E3',
          bgcolor: '#FFFFFF',
          mb: 4,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Chip
            label="PELACAKAN STATUS TERINTEGRASI"
            size="small"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
              bgcolor: '#EBF2FF',
              color: '#1249B8',
              border: '1px solid #C8D2E3',
              mb: 1.5,
            }}
          />
          <Typography variant="h2" sx={{ fontSize: '2rem', color: '#081F4F', mb: 1 }}>
            Cek Status Permohonan
          </Typography>
          <Typography variant="body1" sx={{ color: '#4F5D75', maxWidth: 560, mx: 'auto' }}>
            Masukkan Request ID permohonan Anda di bawah ini untuk melihat perkembangan dan alur verifikasi terkini.
          </Typography>
        </Box>

        {/* Input Form Search Request ID */}
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              border: validationError ? '1px solid #FF2E2E' : '1px solid #C8D2E3',
              bgcolor: '#FFFFFF',
              '&:focus-within': {
                borderColor: '#1249B8',
              },
            }}
          >
            <KeyIcon sx={{ color: '#4F5D75', ml: 1, mr: 0.5, fontSize: 18 }} />
            <InputBase
              placeholder="Masukkan Request ID (misal: REQ-2026-000001)..."
              value={inputReqId}
              onChange={(e) => {
                setInputReqId(e.target.value);
                if (validationError) setValidationError('');
              }}
              sx={{
                ml: 1,
                flex: 1,
                fontWeight: 500,
                fontSize: '0.9rem',
                fontFamily: '"JetBrains Mono", monospace',
                color: '#081F4F',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="medium"
              startIcon={<SearchIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderRadius: '6px',
                px: 2.5,
                py: 0.9,
                fontWeight: 600,
                textTransform: 'none',
                bgcolor: '#1249B8',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#0A2E73' },
              }}
            >
              Cari
            </Button>
          </Paper>

          {validationError && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: '8px',
                border: '1px solid #FF2E2E',
                bgcolor: '#FFEBEB',
                color: '#FF2E2E',
              }}
            >
              {validationError}
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Result Section */}
      {data && (
        <Box>
          <Typography variant="h3" sx={{ fontSize: '1.25rem', mb: 2, color: '#081F4F', px: 0.5 }}>
            Hasil Pelacakan Permohonan
          </Typography>
          <StatusCard data={data} />
        </Box>
      )}

      {error && (
        <ErrorState
          error={error}
          title="Permohonan Tidak Ditemukan"
          message={error.message || 'Request ID yang Anda masukkan tidak terdaftar atau telah dihapus dari sistem.'}
          onRetry={() => {
            if (inputReqId) checkStatus(inputReqId.trim().toUpperCase());
          }}
        />
      )}
    </Container>
  );
};

