import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#005F73',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0A9396',
    },
    railwayRed: {
      main: '#BB3E03',
      contrastText: '#FFFFFF',
    },
    railwayAmber: {
      main: '#EE9B00',
      contrastText: '#000000',
    },
    background: {
      default: '#E9E9E9',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
  },
});