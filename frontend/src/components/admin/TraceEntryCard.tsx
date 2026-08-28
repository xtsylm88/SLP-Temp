// frontend/src/components/admin/TraceEntryCard.tsx
import React from 'react';
import { Paper, Box, Typography, Chip, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import TagIcon from '@mui/icons-material/Tag';
import StorageIcon from '@mui/icons-material/Storage';
import { AuditLogDTO } from '../../types/admin';
import { PayloadViewer } from './PayloadViewer';

interface TraceEntryCardProps {
  entry: AuditLogDTO;
  index: number;
}

export const TraceEntryCard: React.FC<TraceEntryCardProps> = ({ entry, index }) => {
  const getLevelChip = (level: string) => {
    const upperLevel = (level || 'INFO').toUpperCase();
    switch (upperLevel) {
      case 'ERROR':
        return (
          <Chip
            label="ERROR"
            size="small"
            sx={{
              bgcolor: '#fee2e2',
              color: '#991b1b',
              fontWeight: 800,
              fontSize: '0.7rem',
              borderRadius: '6px',
            }}
          />
        );
      case 'WARN':
      case 'WARNING':
        return (
          <Chip
            label="WARN"
            size="small"
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              fontWeight: 800,
              fontSize: '0.7rem',
              borderRadius: '6px',
            }}
          />
        );
      case 'DEBUG':
        return (
          <Chip
            label="DEBUG"
            size="small"
            sx={{
              bgcolor: '#f1f5f9',
              color: '#475569',
              fontWeight: 800,
              fontSize: '0.7rem',
              borderRadius: '6px',
            }}
          />
        );
      default:
        return (
          <Chip
            label="INFO"
            size="small"
            sx={{
              bgcolor: '#e0e7ff',
              color: '#3730a3',
              fontWeight: 800,
              fontSize: '0.7rem',
              borderRadius: '6px',
            }}
          />
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#cbd5e1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        },
      }}
    >
      {/* Step Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Chip
            label={`Entry #${index + 1}`}
            size="small"
            sx={{
              bgcolor: '#f1f5f9',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
          {getLevelChip(entry.level)}
          <Chip
            icon={<StorageIcon sx={{ fontSize: '0.85rem !important' }} />}
            label={entry.service || 'SERVICE'}
            size="small"
            variant="outlined"
            sx={{
              borderColor: '#e2e8f0',
              color: '#0284c7',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: '6px',
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#64748b' }}>
          <AccessTimeIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
            {formatDate(entry.timestamp)}
          </Typography>
        </Stack>
      </Box>

      {/* Action Title & Message */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
          {entry.action || 'UNSPECIFIED_ACTION'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.5 }}>
          {entry.message || 'Tidak ada pesan detail.'}
        </Typography>
      </Box>

      {/* Meta Row */}
      <Stack direction="row" spacing={3} sx={{ mb: 2, bgcolor: '#f8fafc', p: 1.5, borderRadius: '10px', border: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonIcon sx={{ fontSize: 18, color: '#64748b' }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1 }}>
              Actor Email
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8rem' }}>
              {entry.actor_email || '(System / Public)'}
            </Typography>
          </Box>
        </Box>

        {entry.request_id && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TagIcon sx={{ fontSize: 18, color: '#64748b' }} />
            <Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1 }}>
                Request ID
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#1e293b', fontSize: '0.8rem' }}>
                {entry.request_id}
              </Typography>
            </Box>
          </Box>
        )}
      </Stack>

      {/* Payload Viewer Accordion */}
      <PayloadViewer payload={entry.payload} />
    </Paper>
  );
};
