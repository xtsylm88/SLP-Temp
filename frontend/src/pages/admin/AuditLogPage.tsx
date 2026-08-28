// frontend/src/pages/admin/AuditLogPage.tsx
import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuditLog } from '../../hooks/useAuditLog';
import { SearchToolbar } from '../../components/admin/SearchToolbar';
import { AuditLogFilter } from '../../components/admin/AuditLogFilter';
import { AuditLogTable } from '../../components/admin/AuditLogTable';
import { LoadingState } from '../../components/admin/LoadingState';
import { ErrorState } from '../../components/admin/ErrorState';

export const AuditLogPage: React.FC = () => {
  const {
    params,
    data,
    loading,
    error,
    refetch,
    setPage,
    setPageSize,
    setFilters,
    setSorting,
  } = useAuditLog();

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm });
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Dashboard Audit Log
            </Typography>
            <Chip
              icon={<SecurityIcon sx={{ fontSize: '1rem !important' }} />}
              label="Read Only"
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700, borderRadius: '8px' }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Riwayat lengkap aktivitas administrator, pencatatan jejak request, dan investigasi audit sistem.
          </Typography>
        </Box>

        {data && (
          <Paper
            elevation={0}
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: '12px',
              bgcolor: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.15)',
            }}
          >
            <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 700, display: 'block' }}>
              TOTAL AUDIT LOG
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#3730a3' }}>
              {data.total.toLocaleString('id-ID')} Entry
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <SearchToolbar value={params.search || ''} onChange={handleSearch} />
      </Box>

      {/* Advanced Filter */}
      <AuditLogFilter
        filters={params}
        onApplyFilters={setFilters}
        onResetFilters={() =>
          setFilters({
            level: undefined,
            service: undefined,
            actorEmail: undefined,
            startDate: undefined,
            endDate: undefined,
          })
        }
      />

      {/* Content Area */}
      {loading ? (
        <LoadingState message="Memuat daftar audit log dari server..." count={8} />
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Audit Log"
          message={error}
          onRetry={refetch}
        />
      ) : data ? (
        <AuditLogTable
          items={data.items}
          total={data.total}
          page={data.page}
          pageSize={data.pageSize}
          sortBy={params.sortBy || 'timestamp'}
          sortOrder={(params.sortOrder as 'asc' | 'desc') || 'desc'}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSortChange={setSorting}
        />
      ) : null}
    </Box>
  );
};
