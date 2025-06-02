import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { BatteryFull, SdStorage, NetworkWifi } from '@mui/icons-material';

const StatusItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {icon}
    <Typography variant="body2" sx={{ mx: 1, minWidth: 80 }}>
      {label}
    </Typography>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      sx={{ 
        height: 8,
        borderRadius: 4,
        flexGrow: 1,
        '& .MuiLinearProgress-bar': {
          borderRadius: 4,
        }
      }}
    />
    <Typography variant="caption" sx={{ ml: 1, minWidth: 30 }}>
      {value}%
    </Typography>
  </Box>
);

const EquipmentStatus = ({ battery, storage, signal, sx }) => {
  return (
    <Paper sx={{ p: 2, ...sx }}>
      <Typography variant="subtitle1" gutterBottom>
        Equipment Status
      </Typography>
      
      <StatusItem 
        icon={<BatteryFull color={battery > 20 ? 'success' : 'error'} />}
        label="Battery"
        value={battery}
      />
      
      <StatusItem 
        icon={<SdStorage color={storage < 80 ? 'info' : 'warning'} />}
        label="Storage"
        value={storage}
      />
      
      <StatusItem 
        icon={<NetworkWifi color={signal > 50 ? 'success' : 'error'} />}
        label="Signal"
        value={signal}
      />
    </Paper>
  );
};

export default EquipmentStatus;