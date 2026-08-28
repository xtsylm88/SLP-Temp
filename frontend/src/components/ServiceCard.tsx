// frontend/src/components/ServiceCard.tsx

import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { useNavigate } from 'react-router-dom';
import { JenisLayanan } from '../services/jenisLayanan.service';

interface ServiceCardProps {
  service: JenisLayanan;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    navigate('/pengajuan', {
      state: {
        jenis_layanan_id: service.id,
        nama_layanan: service.nama,
        schema_version: service.schema_version,
        field_schema: service.field_schema,
      },
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid #C8D2E3',
        backgroundColor: '#FFFFFF',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#1249B8',
          boxShadow: '0 4px 12px rgba(18, 73, 184, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              bgcolor: '#EBF2FF',
              color: '#1249B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #C8D2E3',
            }}
          >
            <DescriptionOutlinedIcon fontSize="small" />
          </Box>
          <Chip
            label={service.aktif ? 'AKTIF' : 'NON-AKTIF'}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: '0.65rem',
              px: 0.5,
              bgcolor: service.aktif ? '#EBF2FF' : '#FFEBEB',
              color: service.aktif ? '#1249B8' : '#FF2E2E',
              border: '1px solid #C8D2E3',
            }}
          />
        </Box>

        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1, color: '#081F4F', fontSize: '1.1rem' }}>
          {service.nama}
        </Typography>

        <Typography variant="body2" sx={{ color: '#4F5D75', lineHeight: 1.6 }}>
          {service.deskripsi || 'Layanan pendampingan resmi berbasis digital untuk instansi dan entitas publik BPMP Sumsel.'}
        </Typography>


      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          onClick={handleSelect}
          disabled={!service.aktif}
          sx={{
            borderRadius: '6px',
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            bgcolor: '#1249B8',
            color: '#FFFFFF',
            '&:hover': { bgcolor: '#0A2E73' },
          }}
        >
          Ajukan Permohonan
        </Button>
      </CardActions>
    </Card>
  );
};

