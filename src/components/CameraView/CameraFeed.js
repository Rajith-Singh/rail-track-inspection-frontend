import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import {
  Videocam as CameraIcon,
  ViewSidebar as DualCamIcon,
  ChevronLeft as LeftCamIcon,
  ChevronRight as RightCamIcon
} from '@mui/icons-material';
import DefectOverlay from '../common/DefectOverlay';

const CameraFeed = ({ mode, onModeChange, defects }) => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Request webcam access on mount
    let active = true;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => {
        if (active) setStream(mediaStream);
      })
      .catch(() => setStream(null));
    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Paper sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'black',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Camera Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1.5,
        bgcolor: 'rgba(0,0,0,0.8)',
        color: 'white',
        zIndex: 1
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <CameraIcon sx={{ mr: 1 }} />
          {mode === 'dual' ? 'Dual Camera View' : mode === 'left' ? 'Left Rail Camera' : 'Right Rail Camera'}
        </Typography>
        <Box>
          <IconButton 
            onClick={() => onModeChange('dual')} 
            color={mode === 'dual' ? 'primary' : 'inherit'}
            sx={{ color: mode === 'dual' ? '#00FFFF' : 'white' }}
          >
            <DualCamIcon />
          </IconButton>
          <IconButton 
            onClick={() => onModeChange('left')} 
            color={mode === 'left' ? 'primary' : 'inherit'}
            sx={{ color: mode === 'left' ? '#00FFFF' : 'white' }}
          >
            <LeftCamIcon />
          </IconButton>
          <IconButton 
            onClick={() => onModeChange('right')} 
            color={mode === 'right' ? 'primary' : 'inherit'}
            sx={{ color: mode === 'right' ? '#00FFFF' : 'white' }}
          >
            <RightCamIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Camera Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: mode === 'dual' ? 'row' : 'column',
        position: 'relative'
      }}>
        {(mode === 'dual' || mode === 'left') && (
          <SingleCameraFeed 
            side="left"
            defects={defects.filter(d => d.camera === 'left')}
            isDual={mode === 'dual'}
            stream={stream}
          />
        )}
        
        {(mode === 'dual' || mode === 'right') && (
          <SingleCameraFeed 
            side="right"
            defects={defects.filter(d => d.camera === 'right')}
            isDual={mode === 'dual'}
            stream={stream}
          />
        )}
      </Box>
    </Paper>
  );
};

const SingleCameraFeed = ({ side, defects, isDual, stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box sx={{
      position: 'relative',
      width: isDual ? '50%' : '100%',
      height: '100%',
      borderRight: isDual && side === 'left' ? '2px solid #333' : 'none',
      overflow: 'hidden'
    }}>
      {/* Webcam feed */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          background: '#222'
        }}
      />
      <Typography 
        variant="h4" 
        color="white" 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textShadow: '0 0 10px rgba(0,0,0,0.8)',
          opacity: 0.7,
          zIndex: 1
        }}
      >
        {side === 'left' ? 'LEFT RAIL VIEW' : 'RIGHT RAIL VIEW'}
      </Typography>
      
      {/* Defect overlays */}
      {defects.map(defect => (
        <DefectOverlay key={defect.id} defect={defect} />
      ))}
    </Box>
  );
};

export default CameraFeed;