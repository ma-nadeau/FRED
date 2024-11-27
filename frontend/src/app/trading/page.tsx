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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import http from '@fred/lib/http'; // Import your HTTP client
import Link from 'next/link';

// Define the structure of a trading account
interface TradingAccount {
  id: number;
  name: string;
  type: string;
  balance: number;
}

// Add this near other interface/enum definitions
const TradingAccountType = {
  STOCKS: 'STOCK',
  CRYPTO: 'CRYPTO',
};

export default function TradingAccountsPage() {
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    type: '',
    balance: 0,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    type: '',
    balance: 0,
  });

  // Extract fetch logic into a reusable function
  const fetchTradingAccounts = async () => {
    setLoading(true);
    try {
      const response = await http('GET', '/trading-accounts');
      setTradingAccounts(response.data);
    } catch (error) {
      console.error('Error fetching trading accounts:', error);
      const message = error.response?.data?.message || 'Failed to fetch trading accounts';
      setErrorMessage(message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Use the fetch function in useEffect
  useEffect(() => {
    fetchTradingAccounts();
  }, []);

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEdit = (account: TradingAccount) => {
    setSelectedAccount(account);
    setEditFormData({
      name: account.name,
      type: account.type,
      balance: account.balance,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = async (accountId: number) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await http('DELETE', `/trading-accounts/${accountId}`);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting account:', error);
        setErrorMessage('Failed to delete account');
        setSnackbarOpen(true);
      }
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedAccount) return;
    
    try {
      await http('PUT', `/trading-accounts/${selectedAccount.id}`, editFormData);
      window.location.reload();
    } catch (error) {
      console.error('Error updating account:', error);
      setErrorMessage('Failed to update account');
      setSnackbarOpen(true);
    }
  };

  const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check if account type already exists
    const existingAccount = tradingAccounts.find(account => account.type === createFormData.type);
    if (existingAccount) {
      setErrorMessage(`A ${createFormData.type.toLowerCase()} account already exists`);
      setSnackbarOpen(true);
      return;
    }

    try {
      await http('POST', '/trading-accounts', createFormData);
      window.location.reload();
    } catch (error) {
      console.error('Error creating account:', error);
      let errorMessage = 'Failed to create account';

      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message
            .map((err) => Object.values(err.constraints).join(', '))
            .join(', ');
        } else if (typeof error.response.data.message === 'string') {
          errorMessage = error.response.data.message;
        }
      }

      setErrorMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  // Add this helper function to determine which account types are available
  const getAvailableAccountTypes = () => {
    const existingTypes = tradingAccounts.map(account => account.type);
    return Object.values(TradingAccountType).filter(type => !existingTypes.includes(type));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Trading Accounts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Account
        </Button>
      </Box>

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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tradingAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>{account.balance.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(account)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(account.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                    <Link 
                      href={account.type === 'CRYPTO' 
                        ? `/add_crypto_transaction?accountId=${account.id}` 
                        : `/add_stock_transaction?accountId=${account.id}`} 
                      passHref
                    >
                      <Button size="small" variant="outlined" sx={{ ml: 1 }}>
                        Add Transaction
                      </Button>
                    </Link>
                  </TableCell>
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

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Trading Account</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Type"
            value={editFormData.type}
            onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Balance"
            type="number"
            value={editFormData.balance}
            onChange={(e) => setEditFormData({ ...editFormData, balance: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Create Trading Account</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Account Name"
              value={createFormData.name}
              onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
              autoFocus
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="type-label">Account Type</InputLabel>
              <Select
                labelId="type-label"
                value={createFormData.type}
                label="Account Type"
                onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
              >
                {getAvailableAccountTypes().map((accountType) => (
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
              label="Cash Balance"
              type="number"
              value={createFormData.balance}
              onChange={(e) => setCreateFormData({ ...createFormData, balance: Number(e.target.value) })}
            />
            <DialogActions>
              <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button 
                type="submit" 
                variant="contained"
                disabled={getAvailableAccountTypes().length === 0}
              >
                Create
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
