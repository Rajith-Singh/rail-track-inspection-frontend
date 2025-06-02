import React, { useState, useEffect } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import Header from '../components/Navigation/Header';
import CameraFeed from '../components/CameraView/CameraFeed';
import DefectList from '../components/DefectManagement/DefectList';
import TaskProgress from '../components/StatusPanels/TaskProgress';
import EquipmentStatus from '../components/StatusPanels/EquipmentStatus';
import EmergencyButton from '../components/Navigation/EmergencyButton';
import { generateDefects } from '../utils/defectUtils';

const PatrolmanDashboard = () => {
  const theme = useTheme();
  const [cameraMode, setCameraMode] = useState('dual');
  const [activeTab, setActiveTab] = useState('all');
  const [defects, setDefects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDefects(generateDefects(15));
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (id) => {
    setDefects(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'approved' } : d
    ));
  };

  const handleReject = (id) => {
    setDefects(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'rejected' } : d
    ));
  };

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.default,
      overflow: 'hidden'
    }}>
      <Header 
        title="RailTrack Pro Inspector"
        onRefresh={() => window.location.reload()}
        isLoading={isLoading}
      />
      
      <Grid container spacing={2} sx={{ flex: 1, p: 2, overflow: 'hidden' }}>
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <CameraFeed 
            mode={cameraMode}
            onModeChange={setCameraMode}
            defects={defects}
          />
        </Grid>
        
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <DefectList 
            defects={defects}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onApprove={handleApprove}
            onReject={handleReject}
          />
          
          <TaskProgress 
            currentLocation="KM 245+300"
            route="KM 245+000 to KM 247+500"
            progress={65}
            sx={{ mt: 2 }}
          />
          
          <EquipmentStatus 
            battery={78}
            storage={45}
            signal={92}
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
      
      <EmergencyButton />
    </Box>
  );
};

export default PatrolmanDashboard;