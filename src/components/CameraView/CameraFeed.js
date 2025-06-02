import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import {
  Videocam as CameraIcon,
  ViewSidebar as DualCamIcon,
  ChevronLeft as LeftCamIcon,
  ChevronRight as RightCamIcon
} from '@mui/icons-material';
import DefectOverlay from '../common/DefectOverlay';

// Helper to convert canvas to JPEG blob
const getFrameBlob = (video, width = 640, height = 480) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.7);
  });
};

const PREDICT_URL = 'http://localhost:5000/predict'; // Flask endpoint you need to implement

const CameraFeed = ({ mode, onModeChange }) => {
  const [stream, setStream] = useState(null);
  const [defects, setDefects] = useState([]);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

  // Get webcam stream
  useEffect(() => {
    let active = true;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => { if (active) setStream(mediaStream); })
      .catch(() => setStream(null));
    return () => {
      active = false;
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line
  }, []);

  // Real-time prediction loop
  useEffect(() => {
    let running = true;
    const fetchPrediction = async (video, camera) => {
      if (!video || video.readyState < 2) return [];
      const blob = await getFrameBlob(video);
      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');
      formData.append('camera', camera);
      try {
        const res = await fetch(PREDICT_URL, { method: 'POST', body: formData });
        if (!res.ok) return [];
        const data = await res.json();
        // Attach camera info to each defect
        return (data.defects || []).map(d => ({ ...d, camera }));
      } catch {
        return [];
      }
    };

    const loop = async () => {
      while (running) {
        let allDefects = [];
        if (mode === 'dual') {
          const [left, right] = await Promise.all([
            fetchPrediction(leftVideoRef.current, 'left'),
            fetchPrediction(rightVideoRef.current, 'right')
          ]);
          allDefects = [...left, ...right];
        } else if (mode === 'left') {
          allDefects = await fetchPrediction(leftVideoRef.current, 'left');
        } else if (mode === 'right') {
          allDefects = await fetchPrediction(rightVideoRef.current, 'right');
        }
        setDefects(allDefects);
        await new Promise(res => setTimeout(res, 200)); // ~5 FPS
      }
    };
    loop();
    return () => { running = false; };
  }, [mode, stream]);

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
            videoRef={leftVideoRef}
          />
        )}

        {(mode === 'dual' || mode === 'right') && (
          <SingleCameraFeed
            side="right"
            defects={defects.filter(d => d.camera === 'right')}
            isDual={mode === 'dual'}
            stream={stream}
            videoRef={rightVideoRef}
          />
        )}
      </Box>
    </Paper>
  );
};

const SingleCameraFeed = ({ side, defects, isDual, stream, videoRef }) => {
  useEffect(() => {
    if (videoRef && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);
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
        <DefectOverlay key={defect.id || Math.random()} defect={defect} />
      ))}
    </Box>
  );
};

export default CameraFeed;