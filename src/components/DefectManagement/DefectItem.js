import React from 'react';
import { 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Box, 
  Button,
  Typography
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircleOutline as VerifiedIcon
} from '@mui/icons-material';
import SeverityIndicator from '../common/SeverityIndicator';

const DefectItem = ({ defect, onApprove, onReject }) => {
  const getStatusIcon = () => {
    switch(defect.status) {
      case 'approved': return <VerifiedIcon color="success" />;
      case 'rejected': return <ErrorIcon color="error" />;
      default: return <WarningIcon color="warning" />;
    }
  };

  return (
    <ListItem 
      sx={{
        mb: 1,
        borderRadius: 1,
        bgcolor: defect.status === 'approved' ? 
          'success.light' :
          defect.status === 'rejected' ? 
          'error.light' :
          'warning.light',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <ListItemAvatar>
        <SeverityIndicator severity={defect.severity}>
          {getStatusIcon()}
        </SeverityIndicator>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography fontWeight="bold">
              {defect.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {defect.timestamp}
            </Typography>
          </Box>
        }
        secondary={
          <>
            <Typography variant="body2">
              {defect.location}
            </Typography>
            <Typography variant="caption" display="block">
              Confidence: {defect.confidence}
            </Typography>
          </>
        }
        secondaryTypographyProps={{ component: 'div' }}
      />
      {defect.status === 'pending' && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mb: 1,
          gap: 1
        }}>
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<ApproveIcon />}
            onClick={() => onApprove(defect.id)}
            sx={{ minWidth: 100 }}
          >
            Approve
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            startIcon={<RejectIcon />}
            onClick={() => onReject(defect.id)}
            sx={{ minWidth: 100 }}
          >
            Reject
          </Button>
        </Box>
      )}
    </ListItem>
  );
};

export default DefectItem;