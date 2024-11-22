import React, { useState, useEffect } from 'react';
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
    const [accountId, setAccountId] = useState('');
    const [bankAccounts, setBankAccounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch the user's bank accounts on component mount
    useEffect(() => {
        http('GET', '/bank-accounts')
            .then((response) => {
                setBankAccounts(response.data); // Data will already be filtered by the backend
            })
            .catch((error) => {
                console.error('Error fetching bank accounts:', error);
                setMessage('Failed to fetch bank accounts.');
                setOpen(true);
            });
    }, []);



    const handleAddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = {
            description,
            type: transactionType,
            category,
            transactionAt: date,
            amount: Number(amount),
            accountId,
        };

        http('POST', '/transactions', payload)
            .then(() => {
                window.location.href = '/'; // Redirect to the home page or another page
            })
            .catch((error) => {
                console.error('Error adding transaction:', error);

                const errorMessage =
                    error.response?.data?.message === 'Transaction is already saved.'
                        ? 'Transaction is already saved.'
                        : 'Failed to add transaction. Please try again.';

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
                            <MenuItem value="CAR">Car</MenuItem>
                            <MenuItem value="RENT">Rent</MenuItem>
                            <MenuItem value="TUITION">Tuition</MenuItem>
                            <MenuItem value="BILLS">Bills</MenuItem>
                            <MenuItem value="HEALTH">Health</MenuItem>
                            <MenuItem value="MISCELLANEOUS">Other</MenuItem>
                            <MenuItem value="SALARY">Salary</MenuItem>
                            <MenuItem value="OUTINGS">Outings</MenuItem>
                        </TextField>
                        {/* <TextField 
                            margin="normal"
                            required
                            select
                            fullWidth
                            id="accountId"
                            label="Bank Account"
                            name="accountId"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                        >
                            {bankAccounts.map((account) => (
                                <MenuItem key={account.id} value={account.id}>
                                    {account.name} (Balance: {account.balance})
                                </MenuItem>
                            ))}
                        </TextField> */}
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