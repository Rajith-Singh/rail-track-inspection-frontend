import React from 'react';
import { Box, Typography } from '@mui/material';

const DefectOverlay = ({ defect }) => {
  const getColor = () => {
    switch(defect.severity) {
      case 'critical': return '#FF0000';
      case 'high': return '#FF6600';
      case 'medium': return '#FFCC00';
      default: return '#00FF00';
    }
  };
  
  return (
    <Box sx={{
      position: 'absolute',
      top: `${Math.random() * 60 + 20}%`,
      left: `${Math.random() * 60 + 20}%`,
      width: 100,
      height: 100,
      border: `3px dashed ${getColor()}`,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'pulse 2s infinite',
      '@keyframes pulse': {
        '0%': { opacity: 0.7, transform: 'scale(1)' },
        '50%': { opacity: 1, transform: 'scale(1.1)' },
        '100%': { opacity: 0.7, transform: 'scale(1)' }
      }
    }}>
      <Typography 
        variant="caption" 
        fontWeight="bold"
        sx={{ 
          color: 'white',
          textShadow: '0 0 5px rgba(0,0,0,0.8)',
          textAlign: 'center'
        }}
      >
        {defect.type.toUpperCase()}
      </Typography>
    </Box>
  );
};

export default DefectOverlay;