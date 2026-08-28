// frontend/src/components/admin/AuditLogTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Chip,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimelineIcon from '@mui/icons-material/Timeline';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { AuditLogDTO } from '../../types/admin';
import { PayloadViewer } from './PayloadViewer';

interface AuditLogTableProps {
  items: AuditLogDTO[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onSortChange: (property: string, order: 'asc' | 'desc') => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  items,
  total,
  page,
  pageSize,
  sortBy,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [selectedEntry, setSelectedEntry] = useState<AuditLogDTO | null>(null);

  const handleSortRequest = (property: string) => {
    const isAsc = sortBy === property && sortOrder === 'asc';
    onSortChange(property, isAsc ? 'desc' : 'asc');
  };

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

  if (!items || items.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          my: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Data Audit Log Tidak Ditemukan
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Tidak ada riwayat aktivitas yang sesuai dengan kriteria pencarian atau filter Anda.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        bgcolor: '#ffffff',
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                <TableSortLabel
                  active={sortBy === 'timestamp'}
                  direction={sortBy === 'timestamp' ? sortOrder : 'asc'}
                  onClick={() => handleSortRequest('timestamp')}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                <TableSortLabel
                  active={sortBy === 'level'}
                  direction={sortBy === 'level' ? sortOrder : 'asc'}
                  onClick={() => handleSortRequest('level')}
                >
                  Level
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                <TableSortLabel
                  active={sortBy === 'service'}
                  direction={sortBy === 'service' ? sortOrder : 'asc'}
                  onClick={() => handleSortRequest('service')}
                >
                  Service
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                Action
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                <TableSortLabel
                  active={sortBy === 'actorEmail'}
                  direction={sortBy === 'actorEmail' ? sortOrder : 'asc'}
                  onClick={() => handleSortRequest('actorEmail')}
                >
                  Actor Email
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                Request ID
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                Trace ID
              </TableCell>

              <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                Message
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem' }}>
                Aksi
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, idx) => (
              <TableRow
                key={`${row.trace_id}-${row.timestamp}-${idx}`}
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ fontSize: '0.825rem', color: '#1e293b', whiteSpace: 'nowrap' }}>
                  {formatDate(row.timestamp)}
                </TableCell>

                <TableCell>{getLevelChip(row.level)}</TableCell>

                <TableCell sx={{ fontSize: '0.825rem', fontFamily: 'monospace', color: '#0284c7' }}>
                  {row.service || '-'}
                </TableCell>

                <TableCell sx={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
                  {row.action || '-'}
                </TableCell>

                <TableCell sx={{ fontSize: '0.825rem', color: '#475569' }}>
                  {row.actor_email ? (
                    <Typography variant="body2" sx={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }}>
                      {row.actor_email}
                    </Typography>
                  ) : (
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      (System / Public)
                    </Typography>
                  )}
                </TableCell>

                <TableCell sx={{ fontSize: '0.825rem', fontFamily: 'monospace', color: '#64748b' }}>
                  {row.request_id || '-'}
                </TableCell>

                <TableCell sx={{ fontSize: '0.825rem' }}>
                  {row.trace_id ? (
                    <Box
                      component="span"
                      onClick={() => navigate(`/admin/audit-log/${encodeURIComponent(row.trace_id)}`)}
                      sx={{
                        fontFamily: 'monospace',
                        color: '#4f46e5',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': { color: '#3730a3' },
                      }}
                    >
                      {row.trace_id}
                    </Box>
                  ) : (
                    '-'
                  )}
                </TableCell>

                <TableCell sx={{ fontSize: '0.825rem', color: '#334155', maxWidth: 220 }}>
                  <Typography variant="body2" noWrap sx={{ fontSize: '0.825rem' }}>
                    {row.message || '-'}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="Lihat Trace Timeline">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/admin/audit-log/${encodeURIComponent(row.trace_id)}`)}
                      >
                        <TimelineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Detail Payload">
                      <IconButton
                        size="small"
                        sx={{ color: '#64748b' }}
                        onClick={() => setSelectedEntry(row)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page - 1} // MUI uses 0-based index
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Baris per halaman:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`}
      />

      {/* Detail Payload Modal Dialog */}
      <Dialog
        open={Boolean(selectedEntry)}
        onClose={() => setSelectedEntry(null)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Detail Audit Log Entry
          </Typography>
          <IconButton onClick={() => setSelectedEntry(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f8fafc', p: 3 }}>
          {selectedEntry && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, bgcolor: '#ffffff', p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>TIMESTAMP</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatDate(selectedEntry.timestamp)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>LEVEL</Typography>
                  <Box sx={{ mt: 0.5 }}>{getLevelChip(selectedEntry.level)}</Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>ACTION</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{selectedEntry.action}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>SERVICE</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284c7' }}>{selectedEntry.service}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>ACTOR EMAIL</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedEntry.actor_email || '(System)'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>TRACE ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#4f46e5' }}>{selectedEntry.trace_id}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                  PESAN
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <Typography variant="body2">{selectedEntry.message || '-'}</Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                  PAYLOAD (MASKED DEFENSIVELY)
                </Typography>
                <PayloadViewer payload={selectedEntry.payload} defaultExpanded={true} />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setSelectedEntry(null)} sx={{ borderRadius: '10px', textTransform: 'none', bgcolor: '#4f46e5' }}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
