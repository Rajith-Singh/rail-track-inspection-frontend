import React from 'react';
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material';

const Login = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // Add authentication logic here (mock or real)
    window.location.href = '/dashboard';
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Patrolman Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            required
            autoFocus
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            required
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
