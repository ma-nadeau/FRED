'use client';

import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import http from '@fred/lib/http';
import { fetchStockSymbolSuggestions } from '../../services/financeApi';

interface SymbolOption {
  label: string;
  value: string;
}

function UpdateStockTradeTransactionForm() {
  const router = useRouter();
  const { id } = router.query;

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactionAt, setTransactionAt] = useState<Date | null>(null);
  const [transactionType, setTransactionType] = useState<'ADD' | 'REMOVE'>('ADD');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [symbolOptions, setSymbolOptions] = useState<SymbolOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Fetching stock trade transaction:', id);
    if (id) {
    http('GET', `/trade-transactions/${id}`)
    .then((response) => {
      console.log('Stock trade transaction fetched successfully:', response.data);
      const transaction = response.data;
      setSymbol(transaction.symbol);
      setQuantity(transaction.quantity.toString());
      setPrice(transaction.purchasePrice.toString());
      setTransactionAt(new Date(transaction.transactionAt));
      setTransactionType(transaction.purchasePrice ? 'ADD' : 'REMOVE');
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Failed to fetch stock trade transaction. Please try again.');
      setOpen(true);
    });
  }
  }, [id]);
  
  const handleSymbolSearch = async (query: string) => {
    if (query.length < 1) {
      setSymbolOptions([]);
      return;
    }
    setIsLoading(true);
    const suggestions = await fetchStockSymbolSuggestions(query);
    const formattedSuggestions = suggestions.map((suggestion) => ({
      label: `${suggestion.symbol} - ${suggestion.name}`,
      value: suggestion.symbol,
    }));
    setSymbolOptions(formattedSuggestions);
    setIsLoading(false);
  };

  const handleUpdateTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Update Stock Transaction form submitted');
    const requestBody = {
        id: parseInt(id),
        symbol,
        quantity: Number(quantity),
        purchasePrice: transactionType === 'ADD' ? Number(price) : null,
        sellPrice: transactionType === 'REMOVE' ? Number(price) : null,
        transactionAt,
    };

    http('PUT', `/trade-transactions/${id}`, requestBody)
      .then(() => {
        setMessage('Trade stock transaction updated successfully');
        setOpen(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        let errorMessage = 'Failed to update trade stock transaction. Please try again.';

        if (Array.isArray(error.response?.data?.message)) {
          const validationErrors = error.response.data.message;
          errorMessage = validationErrors
            .map((err: { constraints: { [key: string]: string } }) => Object.values(err.constraints).join(', '))
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
            Update Stock Trade Transaction
          </Typography>
          <Box component="form" noValidate onSubmit={handleUpdateTransaction} sx={{ mt: 1 }}>
            <Autocomplete
              freeSolo
              options={symbolOptions}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              inputValue={symbol}
              onInputChange={(event, newInputValue) => {
                const trimmedValue = newInputValue.split('-')[0].trim();
                setSymbol(trimmedValue);
                handleSymbolSearch(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (newValue) {
                  if (typeof newValue === 'string') {
                    setSymbol(newValue.split('-')[0].trim());
                  } else if (newValue.value && newValue.value !== symbol) {
                    setSymbol(newValue.value.trim());
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  required
                  fullWidth
                  id="symbol"
                  label="Symbol"
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
              onChange={(newValue) => setTransactionAt(newValue ? new Date(newValue) : null)}
              renderInput={(params) => <TextField {...params} fullWidth required margin="normal" />}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {'Update Stock'}
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default function UpdateStockTradeTransactionPage() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 2 }}>
        <UpdateStockTradeTransactionForm />
      </Box>
    </LocalizationProvider>
  );
}