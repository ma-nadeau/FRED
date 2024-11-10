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

function DisplayExpenses() {
    //View expenses
    var bankAccountData:any = '';
    const getExpenses = () => {
        http('GET', '/bank-accounts')
            .then(async (response) => {
                console.log('Response:', response);
                bankAccountData = response;
            })
            .catch((error) => {
                console.error('Error:', error);
                let errorMessage = 'Failed to get bank account details for user. Please try again.';

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
            });
    }

    return( <>
        {getExpenses()}
        <h1>Expenses</h1>
    </>);
}

export default function CreateExpensesCollectionPage() {
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
            <DisplayExpenses/>
        </Box>
    );
}