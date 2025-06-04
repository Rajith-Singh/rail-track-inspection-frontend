import React from 'react';
import { Box, Typography } from '@mui/material';

const DefectOverlay = ({ defect, videoWidth, videoHeight }) => {
  const [x1, y1, x2, y2] = defect.bbox || [0, 0, 0, 0];

  // Scale normalized bbox to actual video size
  const left = x1 * videoWidth;
  const top = y1 * videoHeight;
  const width = (x2 - x1) * videoWidth;
  const height = (y2 - y1) * videoHeight;

  // Choose border color based on severity or default
  const getColor = () => {
    switch(defect.severity) {
      case 'critical': return '#FF0000';
      case 'high': return '#FF6600';
      case 'medium': return '#FFCC00';
      default: return '#00FF00';
    }
  };

  // Use defect.type or fallback
  const defectType = defect.type || defect.class_name || "DEFECT";

  return (
    <Box sx={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      border: `3px dashed ${getColor()}`,
      borderRadius: '8px',
      boxSizing: 'border-box',
      pointerEvents: 'none',
      zIndex: 10,
      animation: 'pulse 2s infinite',
      '@keyframes pulse': {
        '0%': { opacity: 0.7, transform: 'scale(1)' },
        '50%': { opacity: 1, transform: 'scale(1.05)' },
        '100%': { opacity: 0.7, transform: 'scale(1)' }
      }
    }}>
      <Typography 
        variant="caption" 
        fontWeight="bold"
        sx={{ 
          color: 'white',
          textShadow: '0 0 5px rgba(0,0,0,0.8)',
          textAlign: 'center',
          userSelect: 'none',
          pointerEvents: 'none',
          width: '100%',
          position: 'absolute',
          top: -20,
          left: 0,
        }}
      >
        {defectType.toUpperCase()}
      </Typography>
    </Box>
  );
};

export default DefectOverlay;
