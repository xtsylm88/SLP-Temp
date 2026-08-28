// frontend/src/components/StepDynamic.tsx

import React from 'react';
import { Typography, Box, Alert } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { DynamicForm } from './DynamicForm';
import { FieldSchemaItem } from '../services/jenisLayanan.service';

interface StepDynamicProps {
  fields: FieldSchemaItem[];
  values: Record<string, unknown>;
  onChange: (fieldId: string, value: unknown) => void;
  errors: Record<string, string>;
  namaLayanan?: string;
}

export const StepDynamic: React.FC<StepDynamicProps> = ({
  fields,
  values,
  onChange,
  errors,
  namaLayanan,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <AssignmentIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Detail Informasi Pendampingan
        </Typography>
      </Box>

      {namaLayanan && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
          Layanan Dipilih: <strong>{namaLayanan}</strong>. Silakan lengkapi formulir spesifik di bawah ini.
        </Alert>
      )}

      <DynamicForm fields={fields} values={values} onChange={onChange} errors={errors} />
    </Box>
  );
};
