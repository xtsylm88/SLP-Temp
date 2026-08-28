// frontend/src/components/DynamicField.tsx

import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { FieldSchemaItem } from '../services/jenisLayanan.service';

interface DynamicFieldProps {
  field: FieldSchemaItem;
  value: unknown;
  onChange: (fieldId: string, val: unknown) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let val: unknown = e.target.value;
    if (field.type === 'number') {
      val = e.target.value === '' ? '' : Number(e.target.value);
    } else if (field.type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    }
    onChange(field.id, val);
  };

  switch (field.type) {
    case 'textarea':
      return (
        <TextField
          id={`field-${field.id}`}
          label={field.label}
          required={field.required}
          value={(value as string) || ''}
          onChange={handleChange}
          placeholder={field.placeholder || `Masukkan ${field.label}`}
          multiline
          rows={4}
          fullWidth
          error={Boolean(error)}
          helperText={error || ''}
        />
      );

    case 'number':
      return (
        <TextField
          id={`field-${field.id}`}
          label={field.label}
          type="number"
          required={field.required}
          value={value !== undefined && value !== null ? String(value) : ''}
          onChange={handleChange}
          placeholder={field.placeholder || `Masukkan ${field.label}`}
          fullWidth
          error={Boolean(error)}
          helperText={error || ''}
        />
      );

    case 'date':
      return (
        <TextField
          id={`field-${field.id}`}
          label={field.label}
          type="date"
          required={field.required}
          value={(value as string) || ''}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          error={Boolean(error)}
          helperText={error || ''}
        />
      );

    case 'select':
      return (
        <TextField
          id={`field-${field.id}`}
          select
          label={field.label}
          required={field.required}
          value={(value as string) || ''}
          onChange={handleChange}
          fullWidth
          error={Boolean(error)}
          helperText={error || ''}
        >
          <MenuItem value="">
            <em>-- Pilih {field.label} --</em>
          </MenuItem>
          {(field.options || []).map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      );

    case 'radio':
      return (
        <FormControl component="fieldset" error={Boolean(error)} fullWidth>
          <FormLabel id={`radio-label-${field.id}`} sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
            {field.label} {field.required && '*'}
          </FormLabel>
          <RadioGroup
            aria-labelledby={`radio-label-${field.id}`}
            name={field.id}
            value={(value as string) || ''}
            onChange={handleChange}
            row
          >
            {(field.options || []).map((opt) => (
              <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      );

    case 'checkbox':
      return (
        <FormControl error={Boolean(error)} component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value)}
                  onChange={handleChange}
                  name={field.id}
                  id={`field-${field.id}`}
                />
              }
              label={`${field.label} ${field.required ? '*' : ''}`}
            />
          </FormGroup>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      );

    case 'text':
    default:
      return (
        <TextField
          id={`field-${field.id}`}
          label={field.label}
          required={field.required}
          value={(value as string) || ''}
          onChange={handleChange}
          placeholder={field.placeholder || `Masukkan ${field.label}`}
          fullWidth
          error={Boolean(error)}
          helperText={error || ''}
        />
      );
  }
};
