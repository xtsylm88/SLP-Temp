// frontend/src/components/AppGuard.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AppGuard extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 500,
              borderRadius: 4,
            }}
          >
            <WarningAmberIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Terjadi Kesalahan pada Aplikasi
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {this.state.error?.message || 'Maaf, sistem mengalami kendala yang tidak terduga.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Muat Ulang Halaman
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

