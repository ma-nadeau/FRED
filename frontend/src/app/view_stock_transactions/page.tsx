'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import http from '@fred/lib/http';
import Link from 'next/link';

interface CryptoTransaction {
  id: number;
  symbol: string;
  quantity: number;
  purchasePrice: number | null;
  sellPrice: number | null;
  transactionAt: Date;
  tradingAccountId: number;
}

interface TradingAccount {
  id: number;
  name: string;
  type: string;
  transactions: CryptoTransaction[];
}

const ViewCryptoTransactions: React.FC = () => {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useState<number | 'all'>('all');
  const [tradingAccounts, setTradingAccounts] = useState<TradingAccount[]>([]);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);

  useEffect(() => {
    const fetchTradingAccounts = async () => {
      try {
        const response = await http('GET', '/trading-accounts');
        const accounts = response.data
        setTradingAccounts(accounts);
        
        const allTransactions = await Promise.all(
          accounts.map(async (account) => {
            const response = await http('GET', `/trading-accounts/${account.id}/transactions`);
            return response.data;
          })
        );
        
        setTransactions(allTransactions.flat());
      } catch (error) {
        console.error('Error fetching trading accounts:', error);
      }
    };

    fetchTradingAccounts();
  }, []);

  const handleAccountChange = async (event: SelectChangeEvent<number | 'all'>) => {
    const newAccountId = event.target.value as number | 'all';
    setSelectedAccountId(newAccountId);
    
    try {
      if (newAccountId === 'all') {
        const allTransactions = await Promise.all(
          tradingAccounts.map(async (account) => {
            const response = await http('GET', `/trading-accounts/${account.id}/transactions`);
            return response.data;
          })
        );
        setTransactions(allTransactions.flat());
      } else {
        const response = await http('GET', `/trading-accounts/${newAccountId}/transactions`);
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const displayTransactions = transactions;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Stock and Crypto Transactions
        </Typography>
        <Link href="/trading" passHref>
          <Button variant="contained" color="primary">
            Back to Trading
          </Button>
        </Link>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Select
          value={selectedAccountId}
          onChange={handleAccountChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Accounts</MenuItem>
          {tradingAccounts.map(account => (
            <MenuItem key={account.id} value={account.id}>{account.name}</MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Purchase Price</TableCell>
              <TableCell>Sell Price</TableCell>
              <TableCell>Transaction Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Account Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayTransactions.map((transaction) => {
              const account = tradingAccounts.find(account => account.id === transaction.tradingAccountId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.symbol}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>
                    {transaction.purchasePrice ? `$${transaction.purchasePrice.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    {transaction.sellPrice ? `$${transaction.sellPrice.toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.transactionAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.purchasePrice ? 'BUY' : 'SELL'}
                  </TableCell>
                  <TableCell>{account?.name}</TableCell>
                  <TableCell>{account?.type}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewCryptoTransactions; 