// frontend/src/components/admin/JenisLayananTable.tsx
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import { JenisLayananAdminDTO } from '../../types/admin';

interface JenisLayananTableProps {
  items: JenisLayananAdminDTO[];
  onEdit: (item: JenisLayananAdminDTO) => void;
  onDisable: (item: JenisLayananAdminDTO) => void;
}

export const JenisLayananTable: React.FC<JenisLayananTableProps> = ({
  items,
  onEdit,
  onDisable,
}) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
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
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: '#f1f5f9', color: '#64748b', mb: 2 }}>
          <InboxIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          Belum Ada Master Jenis Layanan
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 450, mx: 'auto' }}>
          Klik tombol "Tambah Jenis Layanan" di atas untuk mendaftarkan layanan baru.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>Nama Jenis Layanan</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#334155' }}>Schema Ver.</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#334155' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>Updated At</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#334155' }}>Aksi</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>
                {row.id}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {row.nama}
                </Typography>
                {row.deskripsi && (
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    {row.deskripsi}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={`v${row.schema_version}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700, borderRadius: '6px' }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.aktif ? 'AKTIF' : 'NON-AKTIF'}
                  color={row.aktif ? 'success' : 'default'}
                  size="small"
                  sx={{ fontWeight: 700, borderRadius: '6px' }}
                />
              </TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.85rem' }}>
                {formatDate(row.updated_at || row.created_at)}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="Edit Master Jenis Layanan">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon fontSize="small" />}
                      onClick={() => onEdit(row)}
                      sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  {row.aktif && (
                    <Tooltip title="Nonaktifkan Layanan (Soft Delete)">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDisable(row)}
                        sx={{ bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
