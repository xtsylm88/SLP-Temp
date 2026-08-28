// frontend/src/components/admin/PermohonanFilter.tsx
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { JenisLayananAdminDTO } from '../../types/admin';

interface PermohonanFilterProps {
  status: string;
  jenisLayananId: string;
  startDate: string;
  endDate: string;
  jenisLayananList: JenisLayananAdminDTO[];
  onFilterChange: (filters: {
    status?: string;
    jenisLayananId?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onReset: () => void;
}

export const PermohonanFilter: React.FC<PermohonanFilterProps> = ({
  status,
  jenisLayananId,
  startDate,
  endDate,
  jenisLayananList,
  onFilterChange,
  onReset,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Status Select */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={status || ''}
            label="Status"
            onChange={(e) => onFilterChange({ status: e.target.value })}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="">
              <em>Semua Status</em>
            </MenuItem>
            <MenuItem value="DRAFT">DRAFT</MenuItem>
            <MenuItem value="SUBMITTED">SUBMITTED</MenuItem>
            <MenuItem value="IN_REVIEW">IN_REVIEW</MenuItem>
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="REJECTED">REJECTED</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            <MenuItem value="PROSES">PROSES (Legacy)</MenuItem>
            <MenuItem value="SELESAI">SELESAI (Legacy)</MenuItem>
            <MenuItem value="DITOLAK">DITOLAK (Legacy)</MenuItem>
          </Select>
        </FormControl>

        {/* Jenis Layanan Select */}
        <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
          <InputLabel id="jenis-filter-label">Jenis Layanan</InputLabel>
          <Select
            labelId="jenis-filter-label"
            id="jenis-filter"
            value={jenisLayananId || ''}
            label="Jenis Layanan"
            onChange={(e) => onFilterChange({ jenisLayananId: e.target.value })}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="">
              <em>Semua Jenis Layanan</em>
            </MenuItem>
            {jenisLayananList.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.nama}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Start Date */}
        <TextField
          label="Dari Tanggal"
          type="date"
          size="small"
          value={startDate || ''}
          onChange={(e) => onFilterChange({ startDate: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {/* End Date */}
        <TextField
          label="Sampai Tanggal"
          type="date"
          size="small"
          value={endDate || ''}
          onChange={(e) => onFilterChange({ endDate: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />

        {/* Reset Button */}
        <Tooltip title="Reset Filter">
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
            sx={{
              borderRadius: '8px',
              height: 40,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Reset
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
};
