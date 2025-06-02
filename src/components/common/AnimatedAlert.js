import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const AnimatedAlert = ({ severity, children }) => {
  const bgColor = severity === 'critical' ? '#FF0000' : '#FFA500';
  
  return (
    <Box sx={{
      bgcolor: bgColor,
      color: 'white',
      p: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'pulse 2s infinite',
      '@keyframes pulse': {
        '0%': { opacity: 0.8 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0.8 }
      }
    }}>
      <WarningIcon sx={{ mr: 1.5, fontSize: 24 }} />
      <Typography variant="subtitle2" fontWeight="bold">
        {children}
      </Typography>
    </Box>
  );
};

export default AnimatedAlert;