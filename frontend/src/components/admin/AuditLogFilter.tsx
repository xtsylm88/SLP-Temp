// frontend/src/components/admin/AuditLogFilter.tsx
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { AuditLogFilterParams } from '../../types/admin';

interface AuditLogFilterProps {
  filters: AuditLogFilterParams;
  onApplyFilters: (filters: Partial<AuditLogFilterParams>) => void;
  onResetFilters: () => void;
}

export const AuditLogFilter: React.FC<AuditLogFilterProps> = ({
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [level, setLevel] = React.useState(filters.level || '');
  const [service, setService] = React.useState(filters.service || '');
  const [actorEmail, setActorEmail] = React.useState(filters.actorEmail || '');
  const [startDate, setStartDate] = React.useState(filters.startDate || '');
  const [endDate, setEndDate] = React.useState(filters.endDate || '');

  React.useEffect(() => {
    setLevel(filters.level || '');
    setService(filters.service || '');
    setActorEmail(filters.actorEmail || '');
    setStartDate(filters.startDate || '');
    setEndDate(filters.endDate || '');
  }, [filters]);

  const handleApply = () => {
    onApplyFilters({
      level: level || undefined,
      service: service || undefined,
      actorEmail: actorEmail ? actorEmail.trim() : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    setLevel('');
    setService('');
    setActorEmail('');
    setStartDate('');
    setEndDate('');
    onResetFilters();
  };

  return (
    <Box
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: '16px',
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(5, 1fr)',
          },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* Date Range Start */}
        <Box>
          <TextField
            fullWidth
            size="small"
            label="Tanggal Mulai"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{
              '& fieldset': { borderRadius: '10px' },
            }}
          />
        </Box>

        {/* Date Range End */}
        <Box>
          <TextField
            fullWidth
            size="small"
            label="Tanggal Selesai"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{
              '& fieldset': { borderRadius: '10px' },
            }}
          />
        </Box>

        {/* Level Filter */}
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="level-filter-label">Level</InputLabel>
            <Select
              labelId="level-filter-label"
              id="level-filter"
              value={level}
              label="Level"
              onChange={(e) => setLevel(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="">Semua Level</MenuItem>
              <MenuItem value="INFO">INFO</MenuItem>
              <MenuItem value="WARN">WARN</MenuItem>
              <MenuItem value="ERROR">ERROR</MenuItem>
              <MenuItem value="DEBUG">DEBUG</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Service Filter */}
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="service-filter-label">Service</InputLabel>
            <Select
              labelId="service-filter-label"
              id="service-filter"
              value={service}
              label="Service"
              onChange={(e) => setService(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              <MenuItem value="">Semua Service</MenuItem>
              <MenuItem value="EXPRESS_ADMIN">EXPRESS_ADMIN</MenuItem>
              <MenuItem value="APP_SCRIPT">APP_SCRIPT</MenuItem>
              <MenuItem value="AdminService">AdminService</MenuItem>
              <MenuItem value="RequestService">RequestService</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Actor Email Filter */}
        <Box>
          <TextField
            fullWidth
            size="small"
            label="Actor Email"
            placeholder="admin@domain.com"
            value={actorEmail}
            onChange={(e) => setActorEmail(e.target.value)}
            sx={{
              '& fieldset': { borderRadius: '10px' },
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#cbd5e1',
            color: '#475569',
          }}
        >
          Reset Filter
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<FilterAltIcon />}
          onClick={handleApply}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            bgcolor: '#4f46e5',
            '&:hover': { bgcolor: '#4338ca' },
          }}
        >
          Terapkan Filter
        </Button>
      </Box>
    </Box>
  );
};
