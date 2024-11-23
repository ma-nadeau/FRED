import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SvgIcon,
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import http from '@fred/lib/http';

const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS_TFSA: 'SAVINGS_TFSA',
  SAVINGS_RRSP: 'SAVINGS_RRSP',
  SAVINGS_TFSH: 'SAVINGS_TFSH',
  CREDIT: 'CREDIT',
};

interface BankAccount {
  id: number;
  name: string;
  type: string;
  // maybe add others
}

function BankAccountForm() {
  const router = useRouter();

  // State variables
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState(AccountType.CHECKING);
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  // Fetch bank accounts on component mount
  useEffect(() => {
    http('GET', '/bank-accounts')
      .then((response) => {
        const accounts: BankAccount[] = response.data;
        setBankAccounts(accounts);
      })
      .catch((error) => {
        console.error('Error fetching bank accounts:', error);
        setMessage('Failed to fetch bank accounts.');
        setOpen(true);
      });
  }, []);

  // Fetch selected bank account details when selectedAccountId changes
  useEffect(() => {
    if (selectedAccountId) {
      http('GET', `/bank-accounts/${selectedAccountId}`)
        .then((response) => {
          const account = response.data;
          setName(account.name);
          setType(account.type);
          setBalance(account.balance.toString());
          setInterestRate(account.interestRate.toString());
        })
        .catch((error) => {
          console.error('Error fetching bank account:', error);
          setMessage('Failed to fetch selected bank account.');
          setOpen(true);
        });
    } else {
      // Reset form fields if no account is selected
      setName('');
      setType(AccountType.CHECKING);
      setBalance('');
      setInterestRate('');
    }
  }, [selectedAccountId]);

  const handleAccountChange = (event) => {
    setSelectedAccountId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedAccountId) {
      setMessage('Please select a bank account to modify.');
      setOpen(true);
      return;
    }

    http('PUT', `/bank-accounts/${selectedAccountId}`, {
      name,
      type,
      balance: Number(balance),
      interestRate: Number(interestRate),
    })
      .then((response) => {
        setMessage('Bank account updated successfully.');
        setOpen(true);
        // Optionally redirect or refresh
      })
      .catch((error) => {
        console.error('Error updating bank account:', error);
        let errorMessage = 'Failed to update bank account. Please try again.';
        if (error.response?.data?.message) {
          if (Array.isArray(error.response.data.message)) {
            errorMessage = error.response.data.message
              .map((err) => Object.values(err.constraints).join(', '))
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
    <Grid
      container
      component="main"
      sx={{ height: '100vh' }}
      justifyContent="center"
      alignItems="center"
    >
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
            Modify Bank Account
          </Typography>

          {/* Drop-down to select bank account */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-account-label">Select Bank Account</InputLabel>
            <Select
              labelId="select-account-label"
              id="select-account"
              value={selectedAccountId}
              label="Select Bank Account"
              onChange={handleAccountChange}
            >
              <MenuItem value="">
                <em>-- Select an Account --</em>
              </MenuItem>
              {bankAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Modification Form */}
          {selectedAccountId && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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
                Modify Account
              </Button>
            </Box>
          )}
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

export default function ModifyBankAccount() {
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