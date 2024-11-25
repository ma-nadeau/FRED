'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useRouter } from 'next/router';
import http from '../../lib/http';

interface Transaction {
  accountID: number;
  amount: number;
  category: string;
  description: string;
  id: number;
  recurringCashFlowID: number;
  recurringCashFlowName: string;
  transactionAt: Date;
  type: string;
}

interface BankAccount {
  id: number;
  name: string;
  transactions: Transaction[];
}

const ExpensesCollection: React.FC = () => {
  const router = useRouter();
  const [filterType, setFilterType] = useState<string>('none');
  const [selectedFilter, setSelectedFilter] = useState<string | number>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    const getBankAccounts = async () => {
      try {
        const response = await http('GET', '/bank-accounts');
        const accounts: BankAccount[] = response.data.map((account: any) => ({
          id: account.id,
          name: account.name,
          transactions: account.transactions.map((transaction: any) => ({
            accountID: transaction.accountId,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            id: transaction.id,
            recurringCashFlowID: transaction.recurringCashFlowID,
            recurringCashFlowName: transaction.recurringCashFlowName,
            transactionAt: new Date(transaction.transactionAt),
            type: transaction.type,
          })),
        }));
        setBankAccounts(accounts);
        setTransactions(accounts.flatMap(account => account.transactions));
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      }
    };

    getBankAccounts();
  }, []);

  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
    setSelectedFilter('all');
  };

  const handleFilterChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedFilter(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType === 'category' && selectedFilter !== 'all') {
      return transaction.category === selectedFilter;
    }
    if (filterType === 'account' && selectedFilter !== 'all') {
      return transaction.accountID === selectedFilter;
    }
    return true;
  });

  const handleModifyTransaction = (transactionId: number) => {
    router.push(`/update_transaction?id=${transactionId}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Expenses Collection
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Select
          value={filterType}
          onChange={handleFilterTypeChange}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="none">No Filter</MenuItem>
          <MenuItem value="category">Filter by Category</MenuItem>
          <MenuItem value="account">Filter by Bank Account</MenuItem>
        </Select>

        {filterType === 'category' && (
          <Select
            value={selectedFilter}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {Array.from(new Set(transactions.map((transaction) => transaction.category))).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        )}

        {filterType === 'account' && (
          <Select
            value={selectedFilter}
            onChange={handleFilterChange}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Accounts</MenuItem>
            {bankAccounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Bank Account</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{new Date(transaction.transactionAt).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{bankAccounts.find((account) => account.id === transaction.accountID)?.name}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.description || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '8px' }}
                    onClick={() => handleModifyTransaction(transaction.id)}
                  >
                    Modify
                  </Button>
                  <Button variant="contained" color="secondary">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/view_expenses">
        Back to View Expenses
      </Button>
    </Box>
  );
};

export default ExpensesCollection;