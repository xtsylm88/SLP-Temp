// frontend/src/pages/admin/JenisLayananPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useJenisLayananAdmin } from '../../hooks/useJenisLayananAdmin';
import { JenisLayananAdminDTO } from '../../types/admin';
import { JenisLayananTable } from '../../components/admin/JenisLayananTable';
import { JenisLayananDialog } from '../../components/admin/JenisLayananDialog';
import { LoadingState } from '../../components/admin/LoadingState';
import { ErrorState } from '../../components/admin/ErrorState';
import { useApp } from '../../context/AppContext';

export const JenisLayananPage: React.FC = () => {
  const {
    data,
    loading,
    error,
    refetch,
    createJenisLayanan,
    updateJenisLayanan,
    deleteJenisLayanan,
  } = useJenisLayananAdmin();

  const { showNotification } = useApp();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<JenisLayananAdminDTO | null>(null);

  const [disableDialogOpen, setDisableDialogOpen] = useState<boolean>(false);
  const [itemToDisable, setItemToDisable] = useState<JenisLayananAdminDTO | null>(null);
  const [disabling, setDisabling] = useState<boolean>(false);

  const handleOpenAdd = () => {
    setItemToEdit(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: JenisLayananAdminDTO) => {
    setItemToEdit(item);
    setDialogOpen(true);
  };

  const handleOpenDisable = (item: JenisLayananAdminDTO) => {
    setItemToDisable(item);
    setDisableDialogOpen(true);
  };

  const handleSaveSubmit = async (payload: {
    id: string;
    nama: string;
    deskripsi: string;
    schema_version: number;
    field_schema: any;
    aktif: boolean;
  }) => {
    if (itemToEdit) {
      await updateJenisLayanan(payload.id, {
        nama: payload.nama,
        deskripsi: payload.deskripsi,
        schema_version: payload.schema_version,
        field_schema: payload.field_schema,
        aktif: payload.aktif,
      });
      showNotification('Master jenis layanan berhasil diperbarui.', 'success');
    } else {
      await createJenisLayanan(payload);
      showNotification('Master jenis layanan baru berhasil ditambahkan.', 'success');
    }
  };

  const handleDisableConfirm = async () => {
    if (!itemToDisable) return;
    setDisabling(true);
    try {
      await deleteJenisLayanan(itemToDisable.id);
      showNotification(`Jenis layanan '${itemToDisable.nama}' berhasil dinonaktifkan.`, 'success');
      setDisableDialogOpen(false);
      setItemToDisable(null);
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Gagal menonaktifkan jenis layanan.', 'error');
    } finally {
      setDisabling(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Master Jenis Layanan
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Kelola daftar jenis layanan pendampingan dan konfigurasi Field Schema JSON.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Tambah Jenis Layanan
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Memuat master jenis layanan..." variant="skeleton" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <JenisLayananTable
          items={data}
          onEdit={handleOpenEdit}
          onDisable={handleOpenDisable}
        />
      )}

      {/* Add / Edit Dialog */}
      <JenisLayananDialog
        open={dialogOpen}
        itemToEdit={itemToEdit}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveSubmit}
      />

      {/* Confirm Disable (Soft Delete) Dialog */}
      <Dialog
        open={disableDialogOpen}
        onClose={() => setDisableDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#dc2626' }}>Nonaktifkan Jenis Layanan?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Apakah Anda yakin ingin menonaktifkan jenis layanan <strong>{itemToDisable?.nama}</strong> (ID: <code>{itemToDisable?.id}</code>)?
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            Layanan yang dinonaktifkan tidak akan muncul pada form pengajuan publik, namun permohonan lama yang mereferensikan ID ini tetap aman.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDisableDialogOpen(false)} disabled={disabling}>
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={disabling}
            onClick={handleDisableConfirm}
            startIcon={disabling ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{ borderRadius: '8px', fontWeight: 700 }}
          >
            Nonaktifkan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
