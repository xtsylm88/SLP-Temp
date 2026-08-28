// frontend/src/components/StatusCard.tsx

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { PermohonanPublic } from '../services/permohonan.service';

interface StatusCardProps {
  data: PermohonanPublic;
}

/**
 * Pemetaan Lengkap SELURUH Nilai Config.STATUS (Bahasa Inggris Mentah)
 * ke Label Indonesia + Warna Chip MUI + Icon
 */
interface StatusConfig {
  label: string;
  color: 'warning' | 'info' | 'success' | 'error' | 'default';
  icon: React.ReactElement;
  description: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  DRAFT: {
    label: 'Menunggu Verifikasi',
    color: 'warning',
    icon: <PendingIcon fontSize="small" />,
    description: 'Permohonan baru saja dikirim dan menunggu verifikasi awal oleh tim admin.',
  },
  SUBMITTED: {
    label: 'Menunggu Verifikasi',
    color: 'warning',
    icon: <PendingIcon fontSize="small" />,
    description: 'Permohonan telah berhasil diajukan dan sedang mengantre untuk diperiksa verifikator.',
  },
  IN_REVIEW: {
    label: 'Sedang Diproses',
    color: 'info',
    icon: <HourglassTopIcon fontSize="small" />,
    description: 'Permohonan sedang dalam tahap peninjauan materi dan penjadwalan oleh tim teknis.',
  },
  APPROVED: {
    label: 'Disetujui',
    color: 'success',
    icon: <CheckCircleIcon fontSize="small" />,
    description: 'Permohonan pendampingan Anda telah disetujui. Tim kami akan menghubungi Anda.',
  },
  COMPLETED: {
    label: 'Selesai',
    color: 'success',
    icon: <TaskAltIcon fontSize="small" />,
    description: 'Rangkaian kegiatan pendampingan telah selesai dilaksanakan.',
  },
  REJECTED: {
    label: 'Ditolak',
    color: 'error',
    icon: <CancelIcon fontSize="small" />,
    description: 'Permohonan belum dapat disetujui. Silakan periksa atau kontak admin untuk informasi lebih lanjut.',
  },
};

export const StatusCard: React.FC<StatusCardProps> = ({ data }) => {
  const rawStatus = (data.status || '').toUpperCase();
  const statusInfo = STATUS_MAP[rawStatus] || {
    label: rawStatus || 'Status Tidak Diketahui',
    color: 'default' as const,
    icon: <PendingIcon fontSize="small" />,
    description: 'Informasi status permohonan saat ini.',
  };

  const formattedDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '12px',
        border: '1px solid #C8D2E3',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3, bgcolor: '#F3F6FB', borderBottom: '1px solid #C8D2E3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1, color: '#4F5D75' }}>
            Status Permohonan
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"JetBrains Mono", monospace', color: '#081F4F' }}>
            {data.request_id}
          </Typography>
        </Box>

        <Chip
          icon={statusInfo.icon}
          label={statusInfo.label}
          color={statusInfo.color}
          sx={{ fontWeight: 700, px: 1, py: 2, fontSize: '0.85rem', borderRadius: '8px' }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: '#4F5D75' }}>
          {statusInfo.description}
        </Typography>

        <Divider sx={{ mb: 3, borderColor: '#C8D2E3' }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ display: 'block', color: '#4F5D75' }}>
              Jenis Layanan
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#081F4F' }}>
              {data.jenis_layanan || '-'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{ display: 'block', color: '#4F5D75' }}>
              Tanggal Pengajuan
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#081F4F' }}>
              {formattedDate}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
