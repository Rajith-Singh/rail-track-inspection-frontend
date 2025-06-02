import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { theme } from './assets/styles/theme';
import PatrolmanDashboard from './pages/PatrolmanDashboard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<PatrolmanDashboard />} />
          <Route path="/dashboard" element={<PatrolmanDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;