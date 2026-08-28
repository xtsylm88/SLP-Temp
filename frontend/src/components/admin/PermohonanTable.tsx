// frontend/src/components/admin/PermohonanTable.tsx
import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TableContainer,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InboxIcon from '@mui/icons-material/Inbox';
import { PermohonanAdminDTO, JenisLayananAdminDTO } from '../../types/admin';
import { StatusChip } from './StatusChip';
import { useNavigate } from 'react-router-dom';

interface PermohonanTableProps {
  items: PermohonanAdminDTO[];
  jenisLayananList: JenisLayananAdminDTO[];
  sortBy: string;
  sortOrder: 'asc' | 'desc' | string;
  onSortChange: (column: string) => void;
}

export const PermohonanTable: React.FC<PermohonanTableProps> = ({
  items,
  jenisLayananList,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const navigate = useNavigate();

  // Helper map jenis_layanan_id -> Nama Jenis Layanan
  const getJenisLayananName = (id: string) => {
    const found = jenisLayananList.find((j) => j.id === id);
    return found ? found.nama : id || '-';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
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
          Tidak Ada Data Permohonan
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 450, mx: 'auto' }}>
          Belum ada permohonan yang sesuai dengan kriteria pencarian atau filter yang Anda pilih.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>Request ID</TableCell>

            {/* Sortable Tanggal (created_at) */}
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>
              <TableSortLabel
                active={sortBy === 'created_at'}
                direction={sortBy === 'created_at' && sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => onSortChange('created_at')}
              >
                Tanggal
              </TableSortLabel>
            </TableCell>

            {/* Sortable Nama */}
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>
              <TableSortLabel
                active={sortBy === 'nama'}
                direction={sortBy === 'nama' && sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => onSortChange('nama')}
              >
                Nama
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>Instansi</TableCell>
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>Jenis Layanan</TableCell>

            {/* Sortable Status */}
            <TableCell sx={{ fontWeight: 800, color: '#334155' }}>
              <TableSortLabel
                active={sortBy === 'status'}
                direction={sortBy === 'status' && sortOrder === 'asc' ? 'asc' : 'desc'}
                onClick={() => onSortChange('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>

            <TableCell align="center" sx={{ fontWeight: 800, color: '#334155' }}>
              Aksi
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((row) => (
            <TableRow
              key={row.request_id}
              hover
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                transition: 'background-color 0.15s ease',
              }}
            >
              <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5' }}>
                {row.request_id}
              </TableCell>
              <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                {formatDate(row.created_at)}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{row.nama}</TableCell>
              <TableCell sx={{ color: '#475569' }}>{row.instansi || '-'}</TableCell>
              <TableCell sx={{ color: '#334155' }}>{getJenisLayananName(row.jenis_layanan_id)}</TableCell>
              <TableCell>
                <StatusChip status={row.status} />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Lihat Detail Permohonan">
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon fontSize="small" />}
                    onClick={() => navigate(`/admin/permohonan/${row.request_id}`)}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 1.5,
                    }}
                  >
                    Detail
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
