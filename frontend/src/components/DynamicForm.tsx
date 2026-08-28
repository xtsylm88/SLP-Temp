// frontend/src/components/DynamicForm.tsx

import React from 'react';
import { Stack, Alert } from '@mui/material';
import { DynamicField } from './DynamicField';
import { FieldSchemaItem } from '../services/jenisLayanan.service';

interface DynamicFormProps {
  fields: FieldSchemaItem[];
  values: Record<string, unknown>;
  onChange: (fieldId: string, value: unknown) => void;
  errors?: Record<string, string>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, values, onChange, errors = {} }) => {
  if (!fields || fields.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: '12px' }}>
        Tidak ada formulir tambahan spesifik yang diperlukan untuk layanan ini.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      {fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={onChange}
          error={errors[field.id]}
        />
      ))}
    </Stack>
  );
};
