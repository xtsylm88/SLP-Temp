// frontend/src/components/StepPersonal.tsx

import React from 'react';
import { Grid, TextField, Typography, Box } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export interface PersonalInfo {
  nama: string;
  jabatan: string;
  nip: string;
  instansi: string;
  wilayah: string;
  kontak: string;
  email: string;
}

interface StepPersonalProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  errors: Record<string, string>;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({ data, onChange, errors }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <PersonIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Data Identitas Pemohon
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="personal-nama"
            label="Nama Lengkap"
            required
            fullWidth
            value={data.nama}
            onChange={(e) => onChange('nama', e.target.value)}
            error={Boolean(errors.nama)}
            helperText={errors.nama || 'Masukkan nama lengkap beserta gelar'}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="personal-email"
            label="Email Resmi / Dinas"
            type="email"
            required
            fullWidth
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email || 'Contoh: nama@instansi.go.id'}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="personal-jabatan"
            label="Jabatan"
            fullWidth
            value={data.jabatan}
            onChange={(e) => onChange('jabatan', e.target.value)}
            helperText="Jabatan struktural / fungsional"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="personal-nip"
            label="NIP / Nomor Identitas"
            fullWidth
            value={data.nip}
            onChange={(e) => onChange('nip', e.target.value)}
            helperText="NIP ASN atau Nomor Pegawai"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="personal-instansi"
            label="Instansi / Unit Kerja"
            required
            fullWidth
            value={data.instansi}
            onChange={(e) => onChange('instansi', e.target.value)}
            error={Boolean(errors.instansi)}
            helperText={errors.instansi || 'Nama Kementerian/Lembaga/Dinas/Lembaga'}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="personal-wilayah"
            label="Wilayah / Kota / Kabupaten"
            fullWidth
            value={data.wilayah}
            onChange={(e) => onChange('wilayah', e.target.value)}
            helperText="Contoh: DKI Jakarta, Kota Surabaya"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            id="personal-kontak"
            label="Nomor Kontak / Telepon / WA"
            required
            fullWidth
            value={data.kontak}
            onChange={(e) => onChange('kontak', e.target.value)}
            error={Boolean(errors.kontak)}
            helperText={errors.kontak || 'Nomor aktif yang dapat dihubungi'}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
