import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    Typography,
    Paper,
    Box,
    Snackbar,
    MenuItem,
    SvgIcon,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useRouter } from 'next/router';
import http from '@fred/lib/http';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function UpdateTransactionForm() {
    const router = useRouter();
    const { id } = router.query;

    // state variables
    const [description, setDescription] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [amount, setAmount] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    // fetch existing transaction data
    useEffect(() => {
        if (id) {
            http('GET', `/transactions/${id}`)
                .then((response) => {
                    const transaction = response.data;
                    setDescription(transaction.description);
                    setTransactionType(transaction.type);
                    setCategory(transaction.category);
                    setDate(new Date(transaction.transactionAt));
                    setAmount(transaction.amount.toString());
                    console.log('Response:', response);
                })
                .catch((error) => {
                    console.error('Error fetching transaction:', error);
                    setMessage('Error loading transaction data');
                    setOpen(true);
                });
        }
    }, [id]);

    const handleUpdateTransaction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Update Transaction form submitted');
        http('PUT', `/transactions/${id}`, {
            description,
            type: transactionType,
            category,
            transactionAt: date,
            amount: Number(amount)
        })
            .then((response) => {
                console.log('Response:', response);
                window.location.href = '/';
            })
            .catch((error) => {
                console.error('Error:', error);
                let errorMessage = 'Modifying transaction failed. Please try again.';

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
                        Modify Transaction
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleUpdateTransaction} sx={{ mt: 1 }}>
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
                        {<TextField
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
                        </TextField>}
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
                            Modify Transaction
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default function UpdateTransactionPage() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 2 }}>
                <UpdateTransactionForm />
            </Box>
        </LocalizationProvider>
    );
} 