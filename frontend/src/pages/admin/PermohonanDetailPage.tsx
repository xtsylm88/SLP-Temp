// frontend/src/pages/admin/PermohonanDetailPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import HistoryIcon from '@mui/icons-material/History';
import { useParams, useNavigate } from 'react-router-dom';
import { adminPermohonanService } from '../../services/adminPermohonan.service';
import { adminJenisLayananService } from '../../services/adminJenisLayanan.service';
import { PermohonanAdminDTO, JenisLayananAdminDTO, FieldSchemaItem } from '../../types/admin';
import { StatusChip } from '../../components/admin/StatusChip';
import { LoadingState } from '../../components/admin/LoadingState';
import { ErrorState } from '../../components/admin/ErrorState';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';

export const PermohonanDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { showNotification } = useApp();
  const { user } = useAuth();

  const [detail, setDetail] = useState<PermohonanAdminDTO | null>(null);
  const [jenisLayananInfo, setJenisLayananInfo] = useState<JenisLayananAdminDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Dialog states
  const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('PROSES');
  const [pic, setPic] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchDetail = async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    try {
      const data = await adminPermohonanService.getPermohonanDetail(requestId);
      setDetail(data);
      setNewStatus(data.status || 'PROSES');
      setPic(data.pic || user?.name || '');
      setCatatan(data.catatan || '');

      // Fetch corresponding Jenis Layanan schema
      if (data.jenis_layanan_id) {
        try {
          const jenisList = await adminJenisLayananService.getJenisLayananList();
          const match = jenisList.find((j) => j.id === data.jenis_layanan_id);
          setJenisLayananInfo(match || null);
        } catch (e) {
          // fallback
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.';
      if (msg.includes('tidak ditemukan') || msg.includes('404')) {
        setNotFound(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [requestId]);

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId) return;

    setUpdatingStatus(true);
    try {
      await adminPermohonanService.updateStatus(requestId, {
        status: newStatus,
        pic,
        catatan,
      });
      showNotification('Status permohonan berhasil diperbarui.', 'success');
      setStatusDialogOpen(false);
      await fetchDetail();
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Gagal memperbarui status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSoftDeleteSubmit = async () => {
    if (!requestId) return;

    setDeleting(true);
    try {
      await adminPermohonanService.softDelete(requestId);
      showNotification('Permohonan berhasil dinonaktifkan (soft delete).', 'success');
      setDeleteDialogOpen(false);
      navigate('/admin/permohonan');
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Gagal menghapus permohonan.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Memuat detail permohonan..." variant="spinner" />;
  }

  if (notFound) {
    return (
      <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
          Permohonan Tidak Ditemukan
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Request ID <code>{requestId}</code> tidak ditemukan atau telah dihapus.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/permohonan')}
          sx={{ borderRadius: '10px' }}
        >
          Kembali ke Daftar Permohonan
        </Button>
      </Paper>
    );
  }

  if (error || !detail) {
    return <ErrorState message={error || 'Gagal memuat detail permohonan.'} onRetry={fetchDetail} />;
  }

  // Schema matching logic for dynamic json rendering
  const fieldSchema: FieldSchemaItem[] = jenisLayananInfo?.field_schema || [];
  const detailJson: Record<string, unknown> = detail.detail_json || {};

  // Render Value Helper
  const renderValue = (val: unknown): React.ReactNode => {
    if (val === null || val === undefined || val === '') return <Typography variant="body2" color="text.secondary">-</Typography>;
    if (typeof val === 'boolean') return <Typography variant="body2">{val ? 'Ya' : 'Tidak'}</Typography>;
    if (Array.isArray(val)) {
      return (
        <List dense disablePadding>
          {val.map((item, idx) => (
            <ListItem key={idx} disablePadding sx={{ py: 0.25 }}>
              <ListItemText primary={`• ${typeof item === 'object' ? JSON.stringify(item) : String(item)}`} />
            </ListItem>
          ))}
        </List>
      );
    }
    if (typeof val === 'object') {
      return (
        <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', mt: 0.5 }}>
          <Stack spacing={0.5}>
            {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
              <Typography key={k} variant="caption" sx={{ display: 'block' }}>
                <strong>{k}:</strong> {String(v)}
              </Typography>
            ))}
          </Stack>
        </Paper>
      );
    }
    return <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>{String(val)}</Typography>;
  };

  // Find legacy keys in detail_json not in fieldSchema
  const schemaFieldIds = new Set(fieldSchema.map((f) => f.id));
  const legacyKeys = Object.keys(detailJson).filter((k) => !schemaFieldIds.has(k));

  return (
    <Box>
      {/* Navigation Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" underline="hover" onClick={() => navigate('/admin/permohonan')} sx={{ cursor: 'pointer', fontSize: '0.875rem' }}>
          Daftar Permohonan
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
          {detail.request_id}
        </Typography>
      </Breadcrumbs>

      {/* Header Bar */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin/permohonan')}
                sx={{ borderRadius: '8px', textTransform: 'none', minWidth: 40, px: 1 }}
              >
                Kembali
              </Button>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                {detail.request_id}
              </Typography>
              <StatusChip status={detail.status} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Diajukan pada <strong>{new Date(detail.created_at).toLocaleString('id-ID')}</strong>
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setStatusDialogOpen(true)}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            >
              Ubah Status
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
            >
              Nonaktifkan (Soft Delete)
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Left Column: Data Personal & Dynamic Fields */}
        <Stack spacing={3}>
          {/* Personal Info Paper */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'primary.50', color: 'primary.main' }}>
                <PersonIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Data Personal Pemohon
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Nama Pemohon</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>{detail.nama || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Instansi / Perangkat Daerah</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>{detail.instansi || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Jabatan</Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>{detail.jabatan || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>NIP</Typography>
                <Typography variant="body2" sx={{ color: '#334155', fontFamily: 'monospace' }}>{detail.nip || '-'}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Email Contact</Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>{detail.email || '-'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>No. HP / Whatsapp</Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>{detail.kontak || '-'}</Typography>
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Wilayah Permohonan</Typography>
                <Typography variant="body2" sx={{ color: '#334155' }}>{detail.wilayah || '-'}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Field Dinamis Section */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'info.50', color: 'info.main' }}>
                <DynamicFormIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Detail Field Dinamis Permohonan
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {fieldSchema.length === 0 && legacyKeys.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Tidak ada detail kustom / field dinamis untuk permohonan ini.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {fieldSchema.map((field) => {
                  const val = detailJson[field.id];
                  return (
                    <Paper key={field.id} elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 0.5 }}>
                        {field.label} {field.required && <span style={{ color: 'red' }}>*</span>}
                      </Typography>
                      {renderValue(val)}
                    </Paper>
                  );
                })}

                {/* Legacy fields fallback */}
                {legacyKeys.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', display: 'block', mb: 1 }}>
                      FIELD TAMBAHAN / LEGACY FIELD
                    </Typography>
                    {legacyKeys.map((key) => (
                      <Paper key={key} elevation={0} sx={{ p: 2, bgcolor: '#fffbe3', borderRadius: '10px', border: '1px solid #fef08a', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#854d0e', display: 'block', mb: 0.5 }}>
                          {key} (Fallback Label)
                        </Typography>
                        {renderValue(detailJson[key])}
                      </Paper>
                    ))}
                  </Box>
                )}
              </Stack>
            )}
          </Paper>
        </Stack>

        {/* Right Column: Status Summary, PIC & Audit Info */}
        <Stack spacing={3}>
          {/* Service Type Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'warning.50', color: 'warning.main' }}>
                <CategoryIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Jenis Layanan
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Nama Jenis Layanan</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
              {jenisLayananInfo?.nama || detail.jenis_layanan_id}
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Schema Version</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
              v{detail.schema_version}
            </Typography>

            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Jenis Layanan ID</Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#4f46e5' }}>
              {detail.jenis_layanan_id}
            </Typography>
          </Paper>

          {/* PIC & Status Notes */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'secondary.50', color: 'secondary.main' }}>
                <HistoryIcon />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Aksi & Catatan Admin
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status Saat Ini</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusChip status={detail.status} />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>PIC Penanggung Jawab</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {detail.pic || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Catatan Admin / Verifikator</Typography>
                <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#334155', fontStyle: detail.catatan ? 'normal' : 'italic' }}>
                    {detail.catatan || 'Belum ada catatan admin.'}
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Box>

      {/* UPDATE STATUS DIALOG */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Ubah Status Permohonan</DialogTitle>
        <form onSubmit={handleUpdateStatusSubmit}>
          <DialogContent>
            <Stack spacing={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel id="select-status-label">Pilih Status Baru</InputLabel>
                <Select
                  labelId="select-status-label"
                  value={newStatus}
                  label="Pilih Status Baru"
                  onChange={(e) => setNewStatus(e.target.value)}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="DRAFT">DRAFT</MenuItem>
                  <MenuItem value="SUBMITTED">SUBMITTED</MenuItem>
                  <MenuItem value="IN_REVIEW">IN_REVIEW</MenuItem>
                  <MenuItem value="APPROVED">APPROVED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
                  <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="PIC Penanggung Jawab"
                fullWidth
                size="small"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder="Nama Petugas / Verifikator"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              <TextField
                label="Catatan / Alasan Status"
                fullWidth
                multiline
                rows={3}
                size="small"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tambahkan penjelasan atau tindak lanjut permohonan"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setStatusDialogOpen(false)} disabled={updatingStatus}>
              Batal
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updatingStatus}
              startIcon={updatingStatus ? <CircularProgress size={18} color="inherit" /> : undefined}
              sx={{ borderRadius: '8px', fontWeight: 700 }}
            >
              Konfirmasi Perubahan Status
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* SOFT DELETE DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#dc2626' }}>Nonaktifkan Permohonan?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Apakah Anda yakin ingin menonaktifkan permohonan <strong>{detail.request_id}</strong>? Permohonan ini akan ditandai soft delete di database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Batal
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleting}
            onClick={handleSoftDeleteSubmit}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{ borderRadius: '8px', fontWeight: 700 }}
          >
            Nonaktifkan Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
