// frontend/src/components/admin/StatusChip.tsx
import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusChipProps {
  status: string;
  size?: ChipProps['size'];
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const normalized = (status || '').toUpperCase();

  let color: ChipProps['color'] = 'default';
  let label = status || 'DRAFT';

  switch (normalized) {
    case 'SUBMITTED':
      color = 'primary';
      label = 'SUBMITTED';
      break;
    case 'IN_REVIEW':
    case 'PROSES':
      color = 'info';
      label = normalized === 'PROSES' ? 'PROSES' : 'IN REVIEW';
      break;
    case 'APPROVED':
      color = 'success';
      label = 'APPROVED';
      break;
    case 'COMPLETED':
    case 'SELESAI':
      color = 'success';
      label = normalized === 'SELESAI' ? 'SELESAI' : 'COMPLETED';
      break;
    case 'REJECTED':
    case 'DITOLAK':
      color = 'error';
      label = normalized === 'DITOLAK' ? 'DITOLAK' : 'REJECTED';
      break;
    case 'DRAFT':
    default:
      color = 'default';
      label = status ? status.toUpperCase() : 'DRAFT';
      break;
  }

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: '0.75rem',
        borderRadius: '6px',
        px: 0.5,
      }}
    />
  );
};
