import { createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './colors.js';

export const getTheme = (mode: 'light' | 'dark') => {
  const colors = mode === 'light' ? lightTheme : darkTheme;

  return createTheme({
    palette: {
      mode,
      background: {
        default: colors.background,
        paper: colors.cardBackground,
      },
      text: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
      success: {
        main: colors.accent,
      },
      error: {
        main: colors.negative,
      },
    },
    typography: {
     
      h1: {
        fontSize: '1.5rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '0.8rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.875rem',
      },
      body2: {
        fontSize: '0.675rem',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            border:'1px solid #ededed'
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow:`none`,
          },
        },
      },
    },
  });
};