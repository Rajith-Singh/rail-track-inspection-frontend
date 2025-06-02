import React from 'react';
import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material';
import { LocationOn, Refresh } from '@mui/icons-material';
import { DirectionsRailway } from '@mui/icons-material';

const Header = ({ title, onRefresh, isLoading }) => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
      p: 1.5,
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      borderRadius: 1,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    }}>
      <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
        <DirectionsRailway sx={{ mr: 1.5, fontSize: 32 }} />
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip 
          icon={<LocationOn />}
          label="KM 245+300"
          color="secondary"
          sx={{ mr: 2, color: 'white', fontWeight: 'bold' }}
        />
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
          onClick={onRefresh}
          disabled={isLoading}
          sx={{ 
            fontWeight: 'bold',
            px: 3,
            py: 1
          }}
        >
          {isLoading ? 'Syncing...' : 'Refresh'}
        </Button>
      </Box>
    </Box>
  );
};

export default Header;