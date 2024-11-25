'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Snackbar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Autocomplete } from '@mui/material';
import http from '@fred/lib/http';
import { fetchCryptoSymbolSuggestions } from '../../services/financeApi';
import { tr } from 'date-fns/locale';

interface SymbolOption {
  label: string;
  value: string;
}

function AddCryptoTradeTransactionForm() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactionAt, setTransactionAt] = useState<Date | null>(null);
  const [transactionType, setTransactionType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [symbolOptions, setSymbolOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSymbolSearch = async (query: string) => {
    if (query.length < 1) {
      setSymbolOptions([]);
      return;
    }
    setIsLoading(true);
    const suggestions = await fetchCryptoSymbolSuggestions(query);
    setSymbolOptions(suggestions);
    setIsLoading(false);
  };

  const handleAddTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Add Trading Transaction form submitted');
    const requestBody = {
      symbol,
      quantity: Number(quantity),
      purchasePrice: transactionType === 'ADD' ? Number(price) : null,
      sellPrice: transactionType === 'REMOVE' ? Number(price) : null,
      transactionAt,
      tradingAccountId: 1,

    };

    http('POST', '/trade-transactions', requestBody)
      .then(() => {
        setMessage('Crypto trade transaction created successfully');
        setOpen(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        let errorMessage = 'Failed to create crypto trade transaction. Please try again.';

        if (Array.isArray(error.response?.data?.message)) {
          const validationErrors = error.response.data.message;
          errorMessage = validationErrors
            .map((err: any) => Object.values(err.constraints).join(', '))
            .join(' ');
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
            Add Crypto Trade Transaction
          </Typography>
          <Box component="form" noValidate onSubmit={handleAddTransaction} sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              options={symbolOptions}
              getOptionLabel={(option) => option}
              inputValue={symbol}
              onInputChange={(event, newInputValue) => {
                setSymbol(newInputValue.trim());
                handleSymbolSearch(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSymbol(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  fullWidth
                  id="symbol"
                  label="Crypto Symbol"
                  name="symbol"
                />
              )}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="quantity"
              label="Quantity"
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <ToggleButtonGroup
              value={transactionType}
              exclusive
              onChange={(event, newValue) => setTransactionType(newValue)}
              sx={{ mt: 2 }}
            >
              <ToggleButton value="ADD">ADD</ToggleButton>
              <ToggleButton value="REMOVE">REMOVE</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              margin="normal"
              fullWidth
              id="price"
              label={transactionType === 'ADD' ? 'Purchase Price' : 'Sell Price'}
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Transaction Date"
                value={transactionAt}
                onChange={(newValue) => setTransactionAt(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required margin="normal" />}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {transactionType === 'ADD' ? 'Add Crypto' : 'Remove Crypto'}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function AddCryptoTradeTransactionPage() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        <AddCryptoTradeTransactionForm />
      </Box>
    </LocalizationProvider>
  );
}
