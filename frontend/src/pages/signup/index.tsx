import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box, Snackbar } from '@mui/material';
import http from '@fred/lib/http';

function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Signup form submitted');
        http('POST', '/auth/signup', { name, email, age: Number(age), password })
            .then(async (response) => {
                console.log('Response:', response);
                localStorage.setItem('token', response.data.accessToken);
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error('Error:', error);
                let errorMessage = 'Signup failed. Please try again.';

                if (Array.isArray(error.response?.data?.message)) {
                    const validationErrors = error.response.data.message;
                    errorMessage = validationErrors.map((err: any) => Object.values(err.constraints).join(', ')).join(' ');
                } else {
                    errorMessage = error.response?.data?.message || errorMessage;
                }

                setMessage(errorMessage);
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
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSignup} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="age"
                            label="Age"
                            name="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
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
                            Sign Up
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default function SignupPage() {
    return <SignupForm />;
}
