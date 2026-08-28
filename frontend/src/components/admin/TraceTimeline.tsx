// frontend/src/components/admin/TraceTimeline.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AuditLogDTO } from '../../types/admin';
import { TraceEntryCard } from './TraceEntryCard';

interface TraceTimelineProps {
  entries: AuditLogDTO[];
  traceId: string;
}

export const TraceTimeline: React.FC<TraceTimelineProps> = ({ entries, traceId }) => {
  if (!entries || entries.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          my: 4,
        }}
      >
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', mb: 2 }}>
          <TimelineIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Trace Not Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 450, mx: 'auto', lineHeight: 1.6 }}>
          Tidak ada entri log yang ditemukan untuk Trace ID <strong style={{ fontFamily: 'monospace' }}>{traceId}</strong>.
        </Typography>
      </Paper>
    );
  }

  // Ensure entries are sorted Timestamp ASC for chronological timeline
  const sortedEntries = [...entries].sort((a, b) => {
    const tA = new Date(a.timestamp).getTime() || 0;
    const tB = new Date(b.timestamp).getTime() || 0;
    return tA - tB;
  });

  return (
    <Box sx={{ position: 'relative', pl: { xs: 2, sm: 4 }, pr: 1, py: 2 }}>
      {/* Vertical Timeline Bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: { xs: 16, sm: 24 },
          width: '3px',
          bgcolor: '#e2e8f0',
          borderRadius: '2px',
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sortedEntries.map((entry, idx) => (
          <Box key={`${entry.timestamp}-${idx}`} sx={{ position: 'relative', pl: { xs: 3, sm: 4 } }}>
            {/* Timeline Dot Indicator */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: -11, sm: -11 },
                top: 20,
                width: 18,
                height: 18,
                borderRadius: '50%',
                bgcolor: '#4f46e5',
                border: '3px solid #ffffff',
                boxShadow: '0 0 0 2px #c7d2fe',
                zIndex: 1,
              }}
            />

            <TraceEntryCard entry={entry} index={idx} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
