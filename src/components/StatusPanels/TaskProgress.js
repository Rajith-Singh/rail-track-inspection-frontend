import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { Schedule, LocationOn } from '@mui/icons-material';

const TaskProgress = ({ currentLocation, route, progress, sx }) => {
  return (
    <Paper sx={{ p: 2, ...sx }}>
      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Schedule sx={{ mr: 1 }} /> Inspection Progress
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <LocationOn color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2">
          <strong>Current:</strong> {currentLocation}
        </Typography>
      </Box>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        <strong>Route:</strong> {route}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1, minWidth: 60 }}>
          {progress}% complete
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 10,
            borderRadius: 5,
            flexGrow: 1,
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default TaskProgress;