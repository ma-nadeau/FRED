import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box, Snackbar, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import http from '@fred/lib/http';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function AddTransactionForm() {
    const [description, setDescription] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Add Transaction form submitted');
        http('POST', '/transactions', {
            description,
            type: transactionType,
            category,
            transactionAt: date,
            amount: Number(amount)
        })
            .then(async (response) => {
                console.log('Response:', response);
                localStorage.setItem('token', response.data.accessToken);
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('Error:', error);
                let errorMessage = 'Add Transaction failed. Please try again.';

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
                        Add Transaction
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleAddTransaction} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            autoFocus
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            select
                            fullWidth
                            id="transactionType"
                            label="Transaction Type"
                            name="transactionType"
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <MenuItem value="DEPOSIT">Deposit</MenuItem>
                            <MenuItem value="WITHDRAWAL">Withdrawal</MenuItem>
                        </TextField>
                        <TextField
                            margin="normal"
                            required
                            select
                            fullWidth
                            id="category"
                            label="Category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="GROCERIES">Groceries</MenuItem>
                            <MenuItem value="ENTERTAINMENT">Entertainment</MenuItem>
                            <MenuItem value="TRANSPORTATION">Transportation</MenuItem>
                            <MenuItem value="UTILITIES">Utilities</MenuItem>
                            <MenuItem value="HEALTH">Health</MenuItem>
                            <MenuItem value="EDUCATION">Education</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                        </TextField>
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth required margin="normal" />}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="amount"
                            label="Amount"
                            name="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Add Transaction
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default function AddTransactionPage() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 2 }}>
                <AddTransactionForm />
            </Box>
        </LocalizationProvider>
    );
}
