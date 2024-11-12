// view_expenses.tsx

import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, ButtonGroup, Button } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { mockBankAccounts, mockTransactions, BankAccount, Transaction } from './mockData';
import Link from 'next/link';

const ViewExpenses: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<number | 'all'>('all');
  const [timeRange, setTimeRange] = useState<string>('Last Month');

  const handleAccountChange = (event: SelectChangeEvent<number | 'all'>) => {
    setSelectedAccountId(event.target.value as number | 'all');
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const getStartDateForRange = (range: string): Date => {
    const currentDate = new Date();
    switch (range) {
      case 'Last Month':
        return new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      case 'Last 6 Months':
        return new Date(currentDate.setMonth(currentDate.getMonth() - 6));
      case 'Last Year':
        return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
      case 'All':
      default:
        return new Date(0); // Very old date to include all transactions
    }
  };

  const filteredTransactions = (mockTransactions || [])
    .filter((transaction) => selectedAccountId === 'all' || transaction.accountId === selectedAccountId)
    .filter((transaction) => new Date(transaction.transactionAt) >= getStartDateForRange(timeRange));

  const groupedDeposits = filteredTransactions
    .filter((transaction) => transaction.type === 'DEPOSIT')
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const groupedWithdrawals = filteredTransactions
    .filter((transaction) => transaction.type === 'WITHDRAWAL')
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const labels = Array.from(new Set([...Object.keys(groupedDeposits), ...Object.keys(groupedWithdrawals)]));
  const depositData = labels.map((label) => groupedDeposits[label] || 0);
  const withdrawalData = labels.map((label) => groupedWithdrawals[label] || 0);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Account:
      </Typography>
      <Select
        value={selectedAccountId}
        onChange={handleAccountChange}
        sx={{ mb: 2, color: 'text.primary', backgroundColor: 'background.paper' }}
      >
        <MenuItem value="all">All Accounts</MenuItem>
        {mockBankAccounts.map((account) => (
          <MenuItem key={account.id} value={account.id}>
            {account.name}
          </MenuItem>
        ))}
      </Select>

      <BarChart
        xAxis={[{ scaleType: 'band', data: labels, label: 'Categories' }]}
        series={[
          { data: depositData, label: 'Deposits', color: 'green' },
          { data: withdrawalData, label: 'Expenses', color: 'red' },
        ]}
        width={500}
        height={300}
      />

      <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ mt: 2 }}>
        <Button onClick={() => handleTimeRangeChange('Last Month')}>Last Month</Button>
        <Button onClick={() => handleTimeRangeChange('Last 6 Months')}>Last 6 Months</Button>
        <Button onClick={() => handleTimeRangeChange('Last Year')}>Last Year</Button>
        <Button onClick={() => handleTimeRangeChange('All')}>All</Button>
      </ButtonGroup>

      <Box sx={{ mt: 2 }}>
        <Link href="/expenses_collection" passHref>
          <Button variant="contained" color="primary">
            Manage Expenses
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ViewExpenses;