import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  List, 
  Divider, 
  Badge,
  Chip
} from '@mui/material';
import {
  NotificationsActive as AlertsIcon,
  ChevronLeft as LeftCamIcon,
  ChevronRight as RightCamIcon
} from '@mui/icons-material';
import DefectItem from './DefectItem';
import AnimatedAlert from '../common/AnimatedAlert';

const DefectList = ({ defects, activeTab, onTabChange, onApprove, onReject }) => {
  const filteredDefects = defects.filter(defect => 
    activeTab === 'all' || defect.camera === activeTab
  );

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        borderTopLeftRadius: 'inherit',
        borderTopRightRadius: 'inherit'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AlertsIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Defect Alerts</Typography>
          <Badge 
            badgeContent={defects.filter(d => d.status === 'pending').length} 
            color="error" 
            sx={{ ml: 'auto' }}
          />
        </Box>
        
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => onTabChange(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              backgroundColor: 'white'
            }
          }}
        >
          <Tab label="All" value="all" />
          <Tab 
            label="Left Rail" 
            value="left" 
            icon={<LeftCamIcon />} 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
          <Tab 
            label="Right Rail" 
            value="right" 
            icon={<RightCamIcon />} 
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>
      
      {/* Critical Alert Banner */}
      {defects.some(d => d.severity === 'critical' && d.status === 'pending') && (
        <AnimatedAlert severity="critical">
          Critical defects require immediate attention!
        </AnimatedAlert>
      )}
      
      {/* Defect List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List disablePadding>
          {filteredDefects.length > 0 ? (
            filteredDefects.map((defect, index) => (
              <React.Fragment key={defect.id}>
                <DefectItem 
                  defect={defect}
                  onApprove={onApprove}
                  onReject={onReject}
                />
                {index < filteredDefects.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No defects found for this view
              </Typography>
            </Box>
          )}
        </List>
      </Box>
      
      {/* Summary Chip */}
      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Chip 
          label={`${filteredDefects.length} defects shown`}
          color="primary"
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

export default DefectList;