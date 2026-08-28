// frontend/src/components/admin/JsonViewer.tsx
import React, { useState } from 'react';
import { Box, Button, Tooltip, Typography, Snackbar, Alert } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

interface JsonViewerProps {
  data: Record<string, unknown> | string | unknown;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  let formattedJson = '';
  try {
    if (typeof data === 'string') {
      const parsed = JSON.parse(data);
      formattedJson = JSON.stringify(parsed, null, 2);
    } else if (data !== null && data !== undefined) {
      formattedJson = JSON.stringify(data, null, 2);
    } else {
      formattedJson = '{}';
    }
  } catch {
    formattedJson = String(data);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setShowToast(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#0f172a',
          color: '#e2e8f0',
          px: 2,
          py: 1,
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          borderBottom: '1px solid #334155',
        }}
      >
        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#94a3b8' }}>
          PAYLOAD JSON
        </Typography>
        <Tooltip title={copied ? 'Tersalin!' : 'Salin JSON'}>
          <Button
            size="small"
            startIcon={copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            onClick={handleCopy}
            sx={{
              color: copied ? '#4ade80' : '#cbd5e1',
              textTransform: 'none',
              fontSize: '0.75rem',
              py: 0.25,
              px: 1,
              borderRadius: '6px',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {copied ? 'Tersalin' : 'Copy JSON'}
          </Button>
        </Tooltip>
      </Box>

      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          bgcolor: '#020617',
          color: '#38bdf8',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          overflowX: 'auto',
          maxHeight: 400,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        <code>{formattedJson}</code>
      </Box>

      <Snackbar
        open={showToast}
        autoHideDuration={2000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%', borderRadius: '8px' }}>
          JSON berhasil disalin ke clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
