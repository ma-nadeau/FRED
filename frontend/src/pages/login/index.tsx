import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box, Snackbar } from '@mui/material';
import http from '@fred/lib/http';
import { getUserDetails } from '@fred/lib/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    http('POST', '/auth/login', { email, password })
      .then(async (response) => {
        console.log('Response:', response);
        localStorage.setItem('token', response.data.accessToken);
        window.location.href = '/';
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Invalid email or password');
        setOpen(true);
      });
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={message}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function App() {
  return <LoginForm />;
}
