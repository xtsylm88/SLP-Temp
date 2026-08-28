// frontend/src/components/admin/PayloadViewer.tsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CodeIcon from '@mui/icons-material/Code';
import { JsonViewer } from './JsonViewer';

interface PayloadViewerProps {
  payload: Record<string, unknown> | string | unknown;
  defaultExpanded?: boolean;
}

export const PayloadViewer: React.FC<PayloadViewerProps> = ({
  payload,
  defaultExpanded = false,
}) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      elevation={0}
      sx={{
        border: '1px solid #e2e8f0',
        borderRadius: '12px !important',
        '&:before': { display: 'none' },
        overflow: 'hidden',
        bgcolor: '#f8fafc',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: '#64748b' }} />}
        sx={{
          px: 2,
          py: 0.5,
          minHeight: 44,
          '& .MuiAccordionSummary-content': {
            my: 0.5,
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        <CodeIcon sx={{ fontSize: 18, color: '#6366f1' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.825rem', color: '#1e293b' }}>
          Lihat Payload Request / Data
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1.5, bgcolor: '#020617' }}>
        <JsonViewer data={payload} />
      </AccordionDetails>
    </Accordion>
  );
};
