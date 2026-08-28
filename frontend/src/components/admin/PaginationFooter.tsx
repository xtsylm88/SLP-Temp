// frontend/src/components/admin/PaginationFooter.tsx
import React from 'react';
import { Box, TablePagination } from '@mui/material';

interface PaginationFooterProps {
  count: number;
  page: number; // 1-indexed in our hook, converted to 0-indexed for MUI TablePagination
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleChangePage = (_event: unknown, newPageZeroIndexed: number) => {
    onPageChange(newPageZeroIndexed + 1); // convert to 1-indexed for backend
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    onRowsPerPageChange(newSize);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        p: 1.5,
        borderTop: '1px solid #e2e8f0',
        bgcolor: '#f8fafc',
      }}
    >
      <TablePagination
        component="div"
        count={count}
        page={Math.max(0, page - 1)}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Baris per halaman:"
        labelDisplayedRows={({ from, to, count: totalCount }) =>
          `${from}–${to} dari ${totalCount !== -1 ? totalCount : `lebih dari ${to}`}`
        }
      />
    </Box>
  );
};
