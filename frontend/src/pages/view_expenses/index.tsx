// view_expenses.tsx

import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, ButtonGroup, Button } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { fetchBankAccounts } from '../expenses_collection/DisplayBankAccounts';
import Link from 'next/link';

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
  balance: number;
  transactions: Transaction[];
}

const ViewExpenses: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<number | 'all'>('all');
  const [timeRange, setTimeRange] = useState<string>('Last Month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accounts = await fetchBankAccounts();
        setBankAccounts(accounts);
        setTransactions(accounts.flatMap(account => account.transactions));
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      }
    };

    fetchData();
  }, []);

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

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesAccount = selectedAccountId === 'all' || transaction.accountID === selectedAccountId;
      return matchesAccount;
    })
    .filter((transaction) => {
      const isInDateRange = new Date(transaction.transactionAt) >= getStartDateForRange(timeRange);
      return isInDateRange;
    });

  const groupedExpenses = filteredTransactions.reduce((acc, transaction) => {
    const key = `${transaction.category}`;
    if (!acc[key]) {
      acc[key] = { deposit: 0, withdrawal: 0 };
    }
    if (transaction.type === 'withdrawal') {
      acc[key].withdrawal += transaction.amount;
    } else {
      acc[key].deposit += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { deposit: number, withdrawal: number }>);

  const labels = Object.keys(groupedExpenses);
  const depositData = labels.map(label => groupedExpenses[label].deposit);
  const withdrawalData = labels.map(label => groupedExpenses[label].withdrawal);

  return (
    <Box>
      <Select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value as number | 'all')}>
        <MenuItem value="all">All Accounts</MenuItem>
        {bankAccounts.map(account => (
          <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
        ))}
      </Select>

      <BarChart
        xAxis={[{ scaleType: 'band', data: labels }]}
        series={[
          { data: depositData, label: 'Deposit', color: 'green' },
          { data: withdrawalData, label: 'Withdrawal', color: 'red' }
        ]}
        width={500}
        height={300}
      />

      <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ mt: 2 }}>
        <Button onClick={() => setTimeRange('Last Month')}>Last Month</Button>
        <Button onClick={() => setTimeRange('Last 6 Months')}>Last 6 Months</Button>
        <Button onClick={() => setTimeRange('Last Year')}>Last Year</Button>
        <Button onClick={() => setTimeRange('All')}>All</Button>
      </ButtonGroup>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" component={Link} href="/expenses_collection">
          Manage Expenses
        </Button>
      </Box>
    </Box>
  );
};

export default ViewExpenses;