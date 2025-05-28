import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Badge,
  Divider,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  NotificationsActive as AlertsIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Videocam as CameraIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircleOutline as VerifiedIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  DirectionsRailway as RailIcon,
  CameraAlt as SingleCamIcon,
  ViewSidebar as DualCamIcon,
  ChevronLeft as LeftCamIcon,
  ChevronRight as RightCamIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Sample data
const defectsData = [
  { 
    id: 1, 
    location: 'KM 245+300', 
    type: 'Left Rail Crack', 
    severity: 'critical', 
    status: 'pending',
    timestamp: '2 min ago',
    confidence: '92%',
    camera: 'left'
  },
  { 
    id: 2, 
    location: 'KM 245+450', 
    type: 'Right Rail Corrosion', 
    severity: 'high', 
    status: 'approved',
    timestamp: '15 min ago',
    confidence: '85%',
    camera: 'right'
  },
  { 
    id: 3, 
    location: 'KM 246+100', 
    type: 'Left Rail Misalignment', 
    severity: 'medium', 
    status: 'rejected',
    timestamp: '1 hour ago',
    confidence: '78%',
    camera: 'left'
  },
];

const PatrolmanDashboard = () => {
  const [defects, setDefects] = useState(defectsData);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState('dual'); // 'dual', 'left', 'right'
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'left', 'right'
  const theme = useTheme();
  const navigate = useNavigate();

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

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would fetch new data
    }, 1000);
  };

  const filteredDefects = defects.filter(defect => {
    if (activeTab === 'all') return true;
    return defect.camera === activeTab;
  });

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return theme.palette.error.main;
      case 'high': return theme.palette.warning.main;
      case 'medium': return theme.palette.info.main;
      default: return theme.palette.success.main;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <VerifiedIcon color="success" />;
      case 'rejected': return <ErrorIcon color="error" />;
      default: return <WarningIcon color="warning" />;
    }
  };

  const getCameraIcon = (camera) => {
    return camera === 'left' ? <LeftCamIcon /> : <RightCamIcon />;
  };

  useEffect(() => {
    // Simulate periodic data refresh
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.default,
      p: 2,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        p: 1,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: 1
      }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
          <RailIcon sx={{ mr: 1 }} />
          eRail Dual-Camera Inspection System
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip 
            icon={<LocationIcon />}
            label="KM 245+300"
            color="secondary"
            sx={{ mr: 2, color: 'white' }}
          />
          <Button 
            variant="contained" 
            color="secondary"
            startIcon={<RefreshIcon />}
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={2} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Camera Feed - Left Panel */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'black',
            position: 'relative'
          }}>
            {/* Camera Header */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              zIndex: 1
            }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CameraIcon sx={{ mr: 1 }} />
                Dual Track Inspection Feed
              </Typography>
              <Box>
                <IconButton 
                  onClick={() => setCameraMode('dual')} 
                  color={cameraMode === 'dual' ? 'primary' : 'inherit'}
                  title="Dual View"
                >
                  <DualCamIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setCameraMode('left')} 
                  color={cameraMode === 'left' ? 'primary' : 'inherit'}
                  title="Left Rail Only"
                >
                  <LeftCamIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setCameraMode('right')} 
                  color={cameraMode === 'right' ? 'primary' : 'inherit'}
                  title="Right Rail Only"
                >
                  <RightCamIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Camera Content */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: cameraMode === 'dual' ? 'row' : 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Left Camera Feed */}
              {(cameraMode === 'dual' || cameraMode === 'left') && (
                <Box sx={{
                  position: 'relative',
                  width: cameraMode === 'dual' ? '50%' : '100%',
                  height: cameraMode === 'dual' ? '100%' : '100%',
                  borderRight: cameraMode === 'dual' ? '1px solid #555' : 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* Placeholder for left camera feed */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #333 25%, #444 25%, #444 50%, #333 50%, #333 75%, #444 75%, #444 100%)',
                    backgroundSize: '20px 20px',
                    opacity: 0.3
                  }} />
                  <Typography variant="h5" color="white" sx={{ zIndex: 1 }}>
                    LEFT RAIL CAMERA
                  </Typography>
                  
                  {/* Simulated defect overlay */}
                  <Box sx={{
                    position: 'absolute',
                    top: '30%',
                    left: cameraMode === 'dual' ? '30%' : '40%',
                    width: 120,
                    height: 120,
                    border: '3px dashed red',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { opacity: 0.7, transform: 'scale(1)' },
                      '50%': { opacity: 1, transform: 'scale(1.05)' },
                      '100%': { opacity: 0.7, transform: 'scale(1)' }
                    }
                  }}>
                    <Typography variant="body2" color="white" fontWeight="bold">
                      CRACK DETECTED
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Right Camera Feed */}
              {(cameraMode === 'dual' || cameraMode === 'right') && (
                <Box sx={{
                  position: 'relative',
                  width: cameraMode === 'dual' ? '50%' : '100%',
                  height: cameraMode === 'dual' ? '100%' : '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {/* Placeholder for right camera feed */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #222 25%, #333 25%, #333 50%, #222 50%, #222 75%, #333 75%, #333 100%)',
                    backgroundSize: '20px 20px',
                    opacity: 0.3
                  }} />
                  <Typography variant="h5" color="white" sx={{ zIndex: 1 }}>
                    RIGHT RAIL CAMERA
                  </Typography>
                  
                  {/* Simulated defect overlay */}
                  <Box sx={{
                    position: 'absolute',
                    top: '60%',
                    left: cameraMode === 'dual' ? '30%' : '40%',
                    width: 120,
                    height: 120,
                    border: '3px dashed orange',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: 'pulse 2s infinite',
                    animationDelay: '0.5s'
                  }}>
                    <Typography variant="body2" color="white" fontWeight="bold">
                      CORROSION
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Camera Footer */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white'
            }}>
              <Typography variant="caption">
                Last updated: {new Date().toLocaleTimeString()}
              </Typography>
              <Typography variant="caption">
                Resolution: 1080p @ 30fps (each camera)
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts Panel - Right Side */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Alerts Header */}
            <Box sx={{
              p: 2,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AlertsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Defect Alerts</Typography>
                <Badge 
                  badgeContent={filteredDefects.filter(d => d.status === 'pending').length} 
                  color="error" 
                  sx={{ ml: 'auto' }}
                />
              </Box>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ mt: 1 }}
                variant="fullWidth"
              >
                <Tab label="All" value="all" />
                <Tab label="Left Rail" value="left" icon={<LeftCamIcon />} iconPosition="start" />
                <Tab label="Right Rail" value="right" icon={<RightCamIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Alerts Content */}
            <Box sx={{ 
              flex: 1,
              overflowY: 'auto',
              p: 1
            }}>
              <List dense>
                {filteredDefects.map((defect) => (
                  <React.Fragment key={defect.id}>
                    <ListItem 
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: defect.status === 'approved' ? 
                          theme.palette.success.light :
                          defect.status === 'rejected' ? 
                          theme.palette.error.light :
                          theme.palette.warning.light,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: getSeverityColor(defect.severity),
                          color: 'white'
                        }}>
                          {getCameraIcon(defect.camera)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography fontWeight="bold">
                              {defect.type}
                            </Typography>
                            <Chip 
                              label={defect.severity.toUpperCase()} 
                              size="small"
                              sx={{ 
                                bgcolor: getSeverityColor(defect.severity),
                                color: 'white'
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">
                              {defect.location}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {defect.timestamp} • Confidence: {defect.confidence}
                            </Typography>
                          </>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </ListItem>
                    {defect.status === 'pending' && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        mb: 1
                      }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<ApproveIcon />}
                          onClick={() => handleApprove(defect.id)}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={() => handleReject(defect.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Current Task Summary */}
            <Box sx={{ 
              p: 2,
              bgcolor: theme.palette.grey[100]
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1 }} /> Current Inspection Task
              </Typography>
              <Typography variant="body2">
                <strong>Route:</strong> KM 245+000 to KM 247+500
              </Typography>
              <Typography variant="body2">
                <strong>Task:</strong> Verify AI-detected defects on both rails
              </Typography>
              <Typography variant="body2">
                <strong>Progress:</strong> 65% complete
              </Typography>
              <Box sx={{ 
                width: '100%',
                height: 8,
                bgcolor: theme.palette.grey[300],
                borderRadius: 4,
                mt: 1,
                overflow: 'hidden'
              }}>
                <Box sx={{ 
                  width: '65%',
                  height: '100%',
                  bgcolor: theme.palette.success.main
                }} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatrolmanDashboard;