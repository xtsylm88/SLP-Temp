// frontend/src/components/admin/SearchToolbar.tsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  value,
  onChange,
  placeholder = 'Cari berdasarkan Request ID, Trace ID, atau Pesan...',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <Tooltip title="Hapus pencarian">
                  <IconButton size="small" onClick={handleClear}>
                    <ClearIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
            sx: {
              borderRadius: '12px',
              bgcolor: '#ffffff',
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
              '&:hover fieldset': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4f46e5',
              },
            },
          },
        }}
      />
    </Box>
  );
};
