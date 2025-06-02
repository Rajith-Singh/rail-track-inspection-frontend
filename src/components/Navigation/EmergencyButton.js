import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';

const EmergencyButton = () => {
  return (
    <Tooltip title="Emergency Report" arrow>
      <Fab
        color="error"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 60,
          height: 60,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(255,0,0,0.7)' },
            '70%': { boxShadow: '0 0 0 15px rgba(255,0,0,0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(255,0,0,0)' }
          }
        }}
      >
        <EmergencyShareIcon fontSize="large" />
      </Fab>
    </Tooltip>
  );
};

export default EmergencyButton;