// frontend/src/pages/admin/TraceTimelinePage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Breadcrumbs, Link, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimelineIcon from '@mui/icons-material/Timeline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTraceTimeline } from '../../hooks/useTraceTimeline';
import { TraceTimeline } from '../../components/admin/TraceTimeline';
import { LoadingState } from '../../components/admin/LoadingState';
import { ErrorState } from '../../components/admin/ErrorState';

export const TraceTimelinePage: React.FC = () => {
  const { traceId } = useParams<{ traceId: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useTraceTimeline(traceId);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/admin')}
          sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Dashboard
        </Link>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate('/admin/audit-log')}
          sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Audit Log
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'monospace' }}>
          {traceId || 'Trace Timeline'}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/admin/audit-log')}
            sx={{
              mb: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              color: '#475569',
              borderRadius: '8px',
              px: 1.5,
              bgcolor: '#f1f5f9',
              '&:hover': { bgcolor: '#e2e8f0' },
            }}
          >
            Kembali ke Daftar Audit Log
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Kronologi Trace Request
            </Typography>
            {traceId && (
              <Chip
                icon={<TimelineIcon sx={{ fontSize: '1rem !important' }} />}
                label={traceId}
                color="primary"
                sx={{
                  bgcolor: '#e0e7ff',
                  color: '#3730a3',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  borderRadius: '8px',
                }}
              />
            )}
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Jejak urutan peristiwa (Correlation Timeline) yang diasosiasikan dengan Trace ID ini secara kronologis (Timestamp ASC).
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={refetch}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            borderColor: '#cbd5e1',
            color: '#475569',
          }}
        >
          Perbarui Timeline
        </Button>
      </Box>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message={`Memuat timeline untuk trace ${traceId}...`} count={4} />
      ) : error ? (
        <ErrorState title="Gagal Memuat Trace Timeline" message={error} onRetry={refetch} />
      ) : data ? (
        <TraceTimeline entries={data.entries} traceId={data.traceId || traceId || ''} />
      ) : null}
    </Box>
  );
};
