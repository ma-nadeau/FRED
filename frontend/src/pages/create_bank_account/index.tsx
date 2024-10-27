import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box, Snackbar, Select, MenuItem, InputLabel, FormControl, IconButton, SvgIcon } from '@mui/material';
import Link from 'next/link';
import http from '@fred/lib/http';

// Define the AccountType enum values
const AccountType = {
    CHECKING: 'CHECKING',
    SAVINGS_TFSA: 'SAVINGS_TFSA',
    SAVINGS_RRSP: 'SAVINGS_RRSP',
    SAVINGS_TFSH: 'SAVINGS_TFSH',
    CREDIT: 'CREDIT',
};

function BankAccountForm() {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [institution, setInstitution] = useState('');
    const [balance, setBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleCreateAccount = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Bank account form submitted');
        http('POST', '/bank-accounts', { name, type, institution, balance: Number(balance), interestRate: Number(interestRate) })
            .then(async (response) => {
                console.log('Response:', response);
                setMessage('Bank account created successfully');
                setOpen(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                let errorMessage = 'Failed to create bank account. Please try again.';

                if (error.response?.data?.message) {
                    if (Array.isArray(error.response.data.message)) {
                        errorMessage = error.response.data.message
                            .map(err => Object.values(err.constraints).join(', '))
                            .join(', ');
                    } else if (typeof error.response.data.message === 'string') {
                        errorMessage = error.response.data.message;
                    } else if (typeof error.response.data.message === 'object') {
                        errorMessage = JSON.stringify(error.response.data.message);
                    }
                }

                setMessage(errorMessage);
                setOpen(true);
            });
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
                        Create Bank Account
                    </Typography>
                    <Box component="form" onSubmit={handleCreateAccount} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Account Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="type-label">Account Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                value={type}
                                label="Account Type"
                                onChange={(e) => setType(e.target.value)}
                            >
                                {Object.values(AccountType).map((accountType) => (
                                    <MenuItem key={accountType} value={accountType}>
                                        {accountType}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="institution"
                            label="Institution"
                            name="institution"
                            autoComplete="institution"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="balance"
                            label="Balance"
                            name="balance"
                            autoComplete="balance"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="interestRate"
                            label="Interest Rate"
                            name="interestRate"
                            autoComplete="interestRate"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create Account
                        </Button>
                    </Box>
                </Box>
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                message={message}
            />
        </Grid>
    );
}

export default function CreateBankAccountPage() {
    return (
        <Box sx={{ p: 2 }}>
            <Link href="/" passHref>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                        <SvgIcon>
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </SvgIcon>
                    }
                    sx={{ mb: 2 }}
                >
                    Back
                </Button>
            </Link>
            <BankAccountForm />
        </Box>
    );
}