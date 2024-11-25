'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
} from '@mui/material';
import http from '@fred/lib/http'; // Import your HTTP client

// Define the structure of a trading account
interface TradingAccount {
  id: number;
  name: string;
  type: string;
  balance: number;
}

export default function TradingAccountsPage() {
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch trading accounts on component mount
  useEffect(() => {
    http('GET', '/trading-accounts')
      .then((response) => {
        setTradingAccounts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching trading accounts:', error);
        const message =
          error.response?.data?.message || 'Failed to fetch trading accounts';
        setErrorMessage(message);
        setSnackbarOpen(true);
        setLoading(false);
      });
  }, []);

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trading Accounts
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Typography color="error">{errorMessage}</Typography>
      ) : tradingAccounts.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tradingAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>{account.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No trading accounts found.</Typography>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </Box>
  );
}
