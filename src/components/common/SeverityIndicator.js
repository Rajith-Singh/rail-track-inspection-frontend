import React from 'react';
import { Avatar } from '@mui/material';

const SeverityIndicator = ({ severity, children }) => {
  const getColor = () => {
    switch(severity) {
      case 'critical': return '#FF0000';
      case 'high': return '#FF6600';
      case 'medium': return '#FFCC00';
      default: return '#00AA00';
    }
  };
  
  return (
    <Avatar sx={{ 
      bgcolor: getColor(),
      color: 'white',
      width: 40,
      height: 40,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      {children}
    </Avatar>
  );
};

export default SeverityIndicator;