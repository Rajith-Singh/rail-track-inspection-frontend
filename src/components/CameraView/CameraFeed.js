import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Box, Typography, Paper } from '@mui/material';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // change if needed

export default function CameraFeed() {
  // Left camera refs and state
  const leftVideoRef = useRef(null);
  const leftCaptureCanvasRef = useRef(null);
  const leftOverlayCanvasRef = useRef(null);
  const [leftDefects, setLeftDefects] = useState([]);

  // Right camera refs and state
  const rightVideoRef = useRef(null);
  const rightCaptureCanvasRef = useRef(null);
  const rightOverlayCanvasRef = useRef(null);
  const [rightDefects, setRightDefects] = useState([]);

  // Socket ref
  const socketRef = useRef(null);

  // Connect to backend socket and handle defect updates
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to backend');
    });

    socketRef.current.on('defect_update', (data) => {
      // Expecting: { left: [...], right: [...] }
      setLeftDefects(data.left || []);
      setRightDefects(data.right || []);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Setup both cameras
  useEffect(() => {
    async function setupCamera(videoRef) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
        }
      } else {
        alert("getUserMedia not supported");
      }
    }
    setupCamera(leftVideoRef);
    setupCamera(rightVideoRef);
  }, []);

  // Send frames for both cameras
  useEffect(() => {
    const sendFrame = (videoRef, canvasRef, cameraLabel) => {
      if (
        !videoRef.current ||
        !canvasRef.current ||
        !socketRef.current ||
        videoRef.current.videoWidth === 0 ||
        videoRef.current.videoHeight === 0
      ) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64image = canvas.toDataURL('image/jpeg', 0.7);
      socketRef.current.emit('send_frame', { image: base64image, camera: cameraLabel });
    };

    const intervalId = setInterval(() => {
      sendFrame(leftVideoRef, leftCaptureCanvasRef, 'left');
      sendFrame(rightVideoRef, rightCaptureCanvasRef, 'right');
    }, 100); // 10 FPS

    return () => clearInterval(intervalId);
  }, []);

  // Draw bounding boxes for left camera
  useEffect(() => {
    if (!leftOverlayCanvasRef.current) return;
    const canvas = leftOverlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Debug: log defects
    if (leftDefects.length === 0) {
      // Optionally, draw a message if no predictions
      ctx.font = '20px Arial';
      ctx.fillStyle = '#888';
      ctx.fillText('No predictions', 20, 40);
    }
    leftDefects.forEach(({ bbox, confidence, class_name }) => {
      if (!bbox || bbox.length !== 4) return;
      let [xmin, ymin, xmax, ymax] = bbox;
      // If values are <= 1, treat as normalized and scale
      if (xmax <= 1 && ymax <= 1) {
        xmin *= 640;
        xmax *= 640;
        ymin *= 480;
        ymax *= 480;
      }
      // Only draw if bbox is valid
      if (xmax > xmin && ymax > ymin) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00e676';
        ctx.fillStyle = '#00e676';
        ctx.font = '16px Arial';
        ctx.beginPath();
        ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
        ctx.stroke();
        ctx.fillText(
          `${class_name ?? ''} ${confidence !== undefined ? (confidence * 100).toFixed(1) + '%' : ''}`,
          xmin,
          ymin > 20 ? ymin - 5 : ymin + 15
        );
      }
    });
    // Debug: log to console
    console.log('Left defects:', leftDefects);
  }, [leftDefects]);

  // Draw bounding boxes for right camera
  useEffect(() => {
    if (!rightOverlayCanvasRef.current) return;
    const canvas = rightOverlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (rightDefects.length === 0) {
      ctx.font = '20px Arial';
      ctx.fillStyle = '#888';
      ctx.fillText('No predictions', 20, 40);
    }
    rightDefects.forEach(({ bbox, confidence, class_name }) => {
      if (!bbox || bbox.length !== 4) return;
      let [xmin, ymin, xmax, ymax] = bbox;
      if (xmax <= 1 && ymax <= 1) {
        xmin *= 640;
        xmax *= 640;
        ymin *= 480;
        ymax *= 480;
      }
      if (xmax > xmin && ymax > ymin) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2979ff';
        ctx.fillStyle = '#2979ff';
        ctx.font = '16px Arial';
        ctx.beginPath();
        ctx.rect(xmin, ymin, xmax - xmin, ymax - ymin);
        ctx.stroke();
        ctx.fillText(
          `${class_name ?? ''} ${confidence !== undefined ? (confidence * 100).toFixed(1) + '%' : ''}`,
          xmin,
          ymin > 20 ? ymin - 5 : ymin + 15
        );
      }
    });
    console.log('Right defects:', rightDefects);
  }, [rightDefects]);

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      bgcolor: '#181c24',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 4,
    }}>
      <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 700, letterSpacing: 2 }}>
        Dual Rail Camera Monitoring
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: 4,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1400,
      }}>
        {/* Left Camera */}
        <Paper elevation={6} sx={{
          bgcolor: '#23293a',
          borderRadius: 3,
          p: 2,
          width: 660,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }}>
          <Typography variant="h6" sx={{ color: '#00e676', mb: 1, fontWeight: 600, letterSpacing: 1 }}>
            LEFT RAIL VIEW
          </Typography>
          <Box sx={{ position: 'relative', width: 640, height: 480, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 12px #0008' }}>
            <video
              ref={leftVideoRef}
              style={{ width: '640px', height: '480px', borderRadius: 2, background: '#111' }}
              muted
              playsInline
            />
            <canvas ref={leftCaptureCanvasRef} style={{ display: 'none' }} />
            <canvas
              ref={leftOverlayCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                width: '640px',
                height: '480px',
              }}
            />
          </Box>
        </Paper>
        {/* Right Camera */}
        <Paper elevation={6} sx={{
          bgcolor: '#23293a',
          borderRadius: 3,
          p: 2,
          width: 660,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
        }}>
          <Typography variant="h6" sx={{ color: '#2979ff', mb: 1, fontWeight: 600, letterSpacing: 1 }}>
            RIGHT RAIL VIEW
          </Typography>
          <Box sx={{ position: 'relative', width: 640, height: 480, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 12px #0008' }}>
            <video
              ref={rightVideoRef}
              style={{ width: '640px', height: '480px', borderRadius: 2, background: '#111' }}
              muted
              playsInline
            />
            <canvas ref={rightCaptureCanvasRef} style={{ display: 'none' }} />
            <canvas
              ref={rightOverlayCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                width: '640px',
                height: '480px',
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
