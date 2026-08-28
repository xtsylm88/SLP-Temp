// frontend/src/components/StepConfirmation.tsx

import React from 'react';
import { Typography, Box, Paper, Grid, Divider, Alert, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PersonalInfo } from './StepPersonal';
import { FieldSchemaItem } from '../services/jenisLayanan.service';

interface StepConfirmationProps {
  personalData: PersonalInfo;
  dynamicFields: FieldSchemaItem[];
  formValues: Record<string, unknown>;
  namaLayanan?: string;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  personalData,
  dynamicFields,
  formValues,
  namaLayanan,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <CheckCircleIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Konfirmasi & Periksa Ulang Pengajuan
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
        Mohon pastikan seluruh data di bawah ini sudah benar sebelum mengirimkan permohonan pendampingan.
      </Alert>

      <Stack spacing={3}>
        {/* Ringkasan Identitas Pemohon */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '16px', bgcolor: '#f8fafc' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
            1. Identitas Pemohon
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Nama Lengkap
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {personalData.nama || '-'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {personalData.email || '-'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Jabatan / NIP
              </Typography>
              <Typography variant="body2">
                {personalData.jabatan || '-'} {personalData.nip ? `(${personalData.nip})` : ''}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Instansi / Wilayah
              </Typography>
              <Typography variant="body2">
                {personalData.instansi || '-'} {personalData.wilayah ? `, ${personalData.wilayah}` : ''}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Kontak
              </Typography>
              <Typography variant="body2">{personalData.kontak || '-'}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Ringkasan Detail Pendampingan */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '16px', bgcolor: '#f8fafc' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            2. Detail Pendampingan ({namaLayanan || 'Jenis Layanan Selected'})
          </Typography>
          <Divider sx={{ my: 1.5 }} />

          {dynamicFields.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Tidak ada parameter khusus untuk jenis layanan ini.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {dynamicFields.map((field) => {
                const rawVal = formValues[field.id];
                let displayVal = '-';
                if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
                  if (field.type === 'checkbox') {
                    displayVal = rawVal ? 'Ya' : 'Tidak';
                  } else if (field.type === 'select' || field.type === 'radio') {
                    const opt = field.options?.find((o) => o.value === rawVal);
                    displayVal = opt ? opt.label : String(rawVal);
                  } else {
                    displayVal = String(rawVal);
                  }
                }

                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={field.id}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {field.label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {displayVal}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};
