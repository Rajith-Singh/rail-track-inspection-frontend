import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button, TextField, Box } from '@mui/material';

const dummyDefectDetails = {
  1: {
    location: 'Mile 12.3',
    type: 'Crack',
    severity: 'High',
    images: ['https://via.placeholder.com/400x200?text=Defect+Image'],
    history: 'First detected on 2025-05-01. Pending approval.',
  },
  2: {
    location: 'Mile 15.7',
    type: 'Wear',
    severity: 'Medium',
    images: ['https://via.placeholder.com/400x200?text=Wear+Image'],
    history: 'Approved and repaired on 2025-05-10.',
  },
  3: {
    location: 'Mile 18.1',
    type: 'Misalignment',
    severity: 'Low',
    images: ['https://via.placeholder.com/400x200?text=Misalignment+Image'],
    history: 'Rejected due to minor impact.',
  },
};

const DefectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const defect = dummyDefectDetails[id];

  if (!defect) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">Defect Not Found</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Defect Details
        </Typography>
        <Typography variant="h6">Location: {defect.location}</Typography>
        <Typography>Type: {defect.type}</Typography>
        <Typography>Severity: {defect.severity}</Typography>
        <Box sx={{ mt: 2 }}>
          {defect.images.map((img, index) => (
            <img key={index} src={img} alt={`${defect.type} defect`} style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 10 }} />
          ))}
        </Box>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mt: 2 }}>
          History: {defect.history}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Add Notes / Comments</Typography>
          <TextField
            multiline
            minRows={4}
            fullWidth
            placeholder="Write your notes here..."
          />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Notes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DefectDetails;
