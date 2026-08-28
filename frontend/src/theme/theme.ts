// frontend/src/theme/theme.ts

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1249B8', // Royal Blue (Official BPMP Primary)
      light: '#2C74F5', // Bright Blue
      dark: '#0A2E73', // Primary Navy
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4F5D75', // Dark Gray (BPMP Neutral)
      light: '#C8D2E3', // Gray Border/Divider
      dark: '#081F4F', // Deep Blue
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F3F6FB', // Official BPMP Light Gray Canvas
      paper: '#FFFFFF',   // Pure White Surface
    },
    text: {
      primary: '#081F4F',   // Deep Blue for crisp high-legibility text
      secondary: '#4F5D75', // Dark Gray Meta/Subtitle
    },
    divider: '#C8D2E3',    // Soft BPMP Gray Structural Divider
    error: {
      main: '#FF2E2E',
      light: '#FFEBEB',
    },
    warning: {
      main: '#F7B500', // Pure Gold Accent
      light: '#FFF8E5', // Warm Gold Tint
    },
    info: {
      main: '#2C74F5', // Bright Blue
      light: '#EBF2FF',
    },
    success: {
      main: '#1249B8', // Royal Blue (Replaces generic green with BPMP official palette)
      light: '#EBF2FF',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "SF Pro Display", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Newsreader", serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
      color: '#081F4F',
    },
    h2: {
      fontFamily: '"Playfair Display", "Newsreader", serif',
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#081F4F',
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#081F4F',
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#081F4F',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#081F4F',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#4F5D75',
    },
    caption: {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '0.75rem',
      color: '#4F5D75',
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8, // Crisp 8px radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#1249B8',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#0A2E73',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        outlined: {
          borderColor: '#C8D2E3',
          color: '#1249B8',
          '&:hover': {
            borderColor: '#1249B8',
            backgroundColor: '#EBF2FF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: '1px solid #C8D2E3',
          backgroundColor: '#FFFFFF',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            borderColor: '#1249B8',
            boxShadow: '0 2px 8px rgba(18, 73, 184, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          boxShadow: 'none',
          border: '1px solid #C8D2E3',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#C8D2E3',
            },
            '&:hover fieldset': {
              borderColor: '#4F5D75',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1249B8',
              borderWidth: 1,
            },
          },
        },
      },
    },
  },
});


