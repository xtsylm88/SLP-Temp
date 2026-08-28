// frontend/src/components/admin/JenisLayananDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { JenisLayananAdminDTO, FieldSchemaItem } from '../../types/admin';
import { JsonSchemaField } from './JsonSchemaField';

interface JenisLayananDialogProps {
  open: boolean;
  itemToEdit: JenisLayananAdminDTO | null;
  onClose: () => void;
  onSubmit: (payload: {
    id: string;
    nama: string;
    deskripsi: string;
    schema_version: number;
    field_schema: FieldSchemaItem[];
    aktif: boolean;
  }) => Promise<void>;
}

export const JenisLayananDialog: React.FC<JenisLayananDialogProps> = ({
  open,
  itemToEdit,
  onClose,
  onSubmit,
}) => {
  const isEditMode = Boolean(itemToEdit);

  const [id, setId] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState<string>('');
  const [schemaVersion, setSchemaVersion] = useState<number>(1);
  const [fieldSchemaText, setFieldSchemaText] = useState<string>('[]');
  const [parsedFieldSchema, setParsedFieldSchema] = useState<FieldSchemaItem[]>([]);
  const [isJsonValid, setIsJsonValid] = useState<boolean>(true);
  const [aktif, setAktif] = useState<boolean>(true);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setId(itemToEdit.id || '');
      setNama(itemToEdit.nama || '');
      setDeskripsi(itemToEdit.deskripsi || '');
      setSchemaVersion(itemToEdit.schema_version || 1);
      const jsonStr = JSON.stringify(itemToEdit.field_schema || [], null, 2);
      setFieldSchemaText(jsonStr);
      setParsedFieldSchema(itemToEdit.field_schema || []);
      setIsJsonValid(true);
      setAktif(itemToEdit.aktif ?? true);
    } else {
      setId('');
      setNama('');
      setDeskripsi('');
      setSchemaVersion(1);
      setFieldSchemaText('[]');
      setParsedFieldSchema([]);
      setIsJsonValid(true);
      setAktif(true);
    }
    setErrorMsg(null);
  }, [itemToEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!id || !id.trim()) {
      setErrorMsg('ID Jenis Layanan tidak boleh kosong.');
      return;
    }
    if (!nama || !nama.trim()) {
      setErrorMsg('Nama Jenis Layanan tidak boleh kosong.');
      return;
    }
    if (!isJsonValid) {
      setErrorMsg('Harap perbaiki format JSON Schema sebelum menyimpan.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        id: id.trim(),
        nama: nama.trim(),
        deskripsi: deskripsi.trim(),
        schema_version: Number(schemaVersion) || 1,
        field_schema: parsedFieldSchema,
        aktif,
      });
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan jenis layanan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1, borderBottom: '1px solid #f1f5f9' }}>
        {isEditMode ? `Edit Master Jenis Layanan: ${itemToEdit?.id}` : 'Tambah Master Jenis Layanan Baru'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {errorMsg}
            </Alert>
          )}

          <Stack spacing={2.5}>
            {/* ID Field (Disabled / Read-only in Edit Mode) */}
            <TextField
              label="ID Jenis Layanan"
              required
              fullWidth
              size="small"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isEditMode}
              helperText={
                isEditMode
                  ? 'Primary Key ID tidak dapat diubah setelah dibuat.'
                  : 'Gunakan identifier unik tanpa spasi (misal: psp_gedung, rekomendasi_teknis).'
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            {/* Nama */}
            <TextField
              label="Nama Jenis Layanan"
              required
              fullWidth
              size="small"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Pendampingan Sektor Perumahan"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            {/* Deskripsi */}
            <TextField
              label="Deskripsi Layanan"
              fullWidth
              multiline
              rows={2}
              size="small"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Penjelasan singkat mengenai permohonan jenis layanan ini"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            {/* Schema Version */}
            <TextField
              label="Schema Version"
              type="number"
              size="small"
              value={schemaVersion}
              onChange={(e) => setSchemaVersion(parseInt(e.target.value, 10) || 1)}
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            {/* Json Schema Field Editor */}
            <JsonSchemaField
              value={fieldSchemaText}
              onChange={(newText, valid, parsed) => {
                setFieldSchemaText(newText);
                setIsJsonValid(valid);
                setParsedFieldSchema(parsed);
              }}
            />

            {/* Status Aktif Switch */}
            <Box sx={{ pt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={aktif}
                    onChange={(e) => setAktif(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Status Aktif (Permohonan dapat diajukan publik jika Aktif)
                  </Typography>
                }
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
          <Button onClick={onClose} color="inherit" disabled={submitting} sx={{ borderRadius: '8px' }}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || !isJsonValid}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ borderRadius: '8px', fontWeight: 700, px: 3 }}
          >
            Simpan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
