// frontend/src/pages/admin/PermohonanPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAdminPermohonan } from '../../hooks/useAdminPermohonan';
import { adminJenisLayananService } from '../../services/adminJenisLayanan.service';
import { JenisLayananAdminDTO } from '../../types/admin';
import { SearchToolbar } from '../../components/admin/SearchToolbar';
import { PermohonanFilter } from '../../components/admin/PermohonanFilter';
import { PermohonanTable } from '../../components/admin/PermohonanTable';
import { PaginationFooter } from '../../components/admin/PaginationFooter';
import { LoadingState } from '../../components/admin/LoadingState';
import { ErrorState } from '../../components/admin/ErrorState';

export const PermohonanPage: React.FC = () => {
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
  } = useAdminPermohonan();

  const [jenisLayananList, setJenisLayananList] = useState<JenisLayananAdminDTO[]>([]);

  useEffect(() => {
    adminJenisLayananService
      .getJenisLayananList()
      .then((res) => setJenisLayananList(res))
      .catch(() => {});
  }, []);

  const handleSortChange = (column: string) => {
    const isAsc = params.sortBy === column && params.sortOrder === 'asc';
    setSorting(column, isAsc ? 'desc' : 'asc');
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      jenisLayananId: '',
      startDate: '',
      endDate: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Daftar Permohonan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Seluruh daftar permohonan pendampingan yang dikirim oleh publik.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          disabled={loading}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Search Toolbar */}
      <Box sx={{ mb: 2 }}>
        <SearchToolbar
          value={params.search || ''}
          onChange={(val) => setFilters({ search: val })}
        />
      </Box>

      {/* Filter Component */}
      <PermohonanFilter
        status={params.status || ''}
        jenisLayananId={params.jenisLayananId || ''}
        startDate={params.startDate || ''}
        endDate={params.endDate || ''}
        jenisLayananList={jenisLayananList}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Content Area */}
      {loading && !data ? (
        <LoadingState message="Memuat daftar permohonan..." variant="skeleton" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <Box>
          <PermohonanTable
            items={data?.items || []}
            jenisLayananList={jenisLayananList}
            sortBy={params.sortBy || 'created_at'}
            sortOrder={params.sortOrder || 'desc'}
            onSortChange={handleSortChange}
          />

          <PaginationFooter
            count={data?.total || 0}
            page={data?.page || 1}
            rowsPerPage={data?.pageSize || 10}
            onPageChange={setPage}
            onRowsPerPageChange={setPageSize}
          />
        </Box>
      )}
    </Box>
  );
};
