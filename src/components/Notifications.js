import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

const sampleNotifications = [
  { id: 1, message: 'Critical defect detected at Mile 12.4', time: '10:15 AM' },
  { id: 2, message: 'Loose bolt detected at Mile 8.2', time: '9:50 AM' },
];

export default function Notifications() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <List>
        {sampleNotifications.map(({ id, message, time }) => (
          <ListItem key={id}>
            <ListItemText primary={message} secondary={time} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
