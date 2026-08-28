// frontend/src/components/admin/JsonSchemaField.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Chip,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { FieldSchemaItem } from '../../types/admin';

interface JsonSchemaFieldProps {
  value: string;
  onChange: (jsonStr: string, isValid: boolean, parsedItems: FieldSchemaItem[]) => void;
}

export const JsonSchemaField: React.FC<JsonSchemaFieldProps> = ({ value, onChange }) => {
  const [jsonText, setJsonText] = useState<string>(value || '');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<FieldSchemaItem[]>([]);

  useEffect(() => {
    setJsonText(value || '');
  }, [value]);

  const validateJson = () => {
    if (!jsonText || !jsonText.trim()) {
      setIsValid(true);
      setErrorMessage(null);
      setParsedItems([]);
      onChange('', true, []);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setIsValid(false);
        setErrorMessage('JSON Schema harus berupa Array dari object field schema.');
        setParsedItems([]);
        onChange(jsonText, false, []);
        return;
      }

      // Check item properties
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.id || !item.label || !item.type) {
          setIsValid(false);
          setErrorMessage(`Item index ${i} wajib memiliki property 'id', 'label', dan 'type'.`);
          setParsedItems([]);
          onChange(jsonText, false, []);
          return;
        }
      }

      setIsValid(true);
      setErrorMessage(null);
      setParsedItems(parsed);
      onChange(jsonText, true, parsed);
    } catch (err) {
      setIsValid(false);
      setErrorMessage(`Format JSON Syntax Error: ${err instanceof Error ? err.message : String(err)}`);
      setParsedItems([]);
      onChange(jsonText, false, []);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155' }}>
          Field Schema JSON Editor
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={validateJson}
          startIcon={isValid ? <CheckCircleIcon color="success" /> : <ErrorIcon color="error" />}
          sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 700 }}
        >
          Validate JSON
        </Button>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={8}
        value={jsonText}
        onChange={(e) => {
          setJsonText(e.target.value);
          // auto revalidate soft
          try {
            const p = JSON.parse(e.target.value);
            if (Array.isArray(p)) {
              setIsValid(true);
              setErrorMessage(null);
              setParsedItems(p);
              onChange(e.target.value, true, p);
            }
          } catch (err) {
            setIsValid(false);
            setErrorMessage('JSON belum valid.');
            onChange(e.target.value, false, []);
          }
        }}
        placeholder={`[\n  {\n    "id": "nomor_surat",\n    "label": "Nomor Surat Permohonan",\n    "type": "text",\n    "required": true\n  }\n]`}
        sx={{
          fontFamily: 'monospace',
          bgcolor: '#f8fafc',
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
          },
        }}
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: '8px' }}>
          {errorMessage}
        </Alert>
      )}

      {isValid && parsedItems.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mt: 2,
            bgcolor: '#f1f5f9',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', display: 'block', mb: 1 }}>
            SCHEMA PREVIEW ({parsedItems.length} Field)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            {parsedItems.map((item, idx) => (
              <Paper
                key={item.id || idx}
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {item.label}
                  </Typography>
                  <Chip
                    label={item.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                  ID: <code>{item.id}</code> | Required: {item.required ? 'Ya' : 'Tidak'}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};
