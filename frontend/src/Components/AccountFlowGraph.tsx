"use client";

import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts";
import {
  Box,
  Button,
  ButtonGroup,
  MenuItem,
  Select,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import Link from "next/link";
import http from "@fred/lib/http";

// Define the types locally:
type Transaction = {
  id: number;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  transactionAt: string; // ISO date string
};

type BankAccount = {
  id: number;
  name: string;
  transactions: Transaction[];
};

const AccountFlowGraph: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("Last Month");
  const [selectedAccountId, setSelectedAccountId] = useState<number | "all">(
    "all"
  );
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  useEffect(() => {
    setIsLoggedIn(window.localStorage.getItem("token") !== null);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBankAccounts();
    }
  }, [isLoggedIn]);

  const fetchBankAccounts = () => {
    http("GET", "/bank-accounts")
      .then((response) => {
        if (response.data) {
          setBankAccounts(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching bank accounts:", error);
      });
  };

  useEffect(() => {
    const newExpenses: Transaction[] = [];
    bankAccounts.forEach((bankAccount) => {
      bankAccount.transactions.forEach((transaction) => {
        if (transaction.type === "WITHDRAWAL") {
          newExpenses.push(transaction);
        }
      });
    });
    setExpenses(newExpenses);
  }, [bankAccounts]);

  // Get all transactions from the current user
  const transactions = bankAccounts.flatMap((account) => account.transactions);

  // Utility function to get transactions for a specific account or all accounts
  const getTransactionsForAccount = (
    accountId: number | "all"
  ): Transaction[] => {
    if (accountId === "all") {
      return transactions;
    }
    return (
      bankAccounts.find((account) => account.id === accountId)?.transactions ||
      []
    );
  };

  // Utility function to subtract time from the current date
  const getStartDateForRange = (range: string): Date => {
    const currentDate = new Date();
    switch (range) {
      case "Last Month":
        return new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      case "Last 6 Months":
        return new Date(currentDate.setMonth(currentDate.getMonth() - 6));
      case "Last Year":
        return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
      case "All":
      default:
        return new Date(0); // Very old date to include all transactions
    }
  };

  // Function to filter transactions based on the selected time range and sort them by date
  const filterTransactionsByTimeRange = (
    accountId: number | "all"
  ): Transaction[] => {
    const accountTransactions = getTransactionsForAccount(accountId);
    const startDate = getStartDateForRange(timeRange);

    // Ensure sorting by transaction date from oldest to newest
    return accountTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.transactionAt);
        return transactionDate >= startDate;
      })
      .sort(
        (a, b) =>
          new Date(a.transactionAt).getTime() -
          new Date(b.transactionAt).getTime()
      ); // Ensure transactions are sorted by date
  };

  // Compute cumulative balance over time for line chart
  const computeCumulativeBalance = (
    transactions: Transaction[]
  ): { x: number; y: number }[] => {
    let cumulativeBalance = 0;
    const dataPoints: { x: number; y: number }[] = [];

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.transactionAt).getTime(); // Timestamp for x-axis
      cumulativeBalance +=
        transaction.type === "DEPOSIT"
          ? transaction.amount
          : -transaction.amount;
      dataPoints.push({ x: transactionDate, y: cumulativeBalance });
    });

    // Add current date as last point on line chart, with the same balance as the last transaction
    const currentDate = new Date().getTime();
    if (
      dataPoints.length > 0 &&
      dataPoints[dataPoints.length - 1].x !== currentDate
    ) {
      dataPoints.push({ x: currentDate, y: cumulativeBalance });
    }

    return dataPoints;
  };

  // Utility function to format a date as "YYYY-MM" for grouping by month
  const formatMonth = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  // Utility function to format a date as "YYYY" for grouping by year
  const formatYear = (date: Date): string => {
    return `${date.getFullYear()}`;
  };

  // Function to group transactions by month or year based on the time range
  const groupTransactions = (
    filteredTransactions: Transaction[]
  ): {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  } => {
    const groupedData = filteredTransactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.transactionAt);
      const key =
        timeRange === "All"
          ? formatYear(transactionDate)
          : formatMonth(transactionDate);

      if (!acc[key]) {
        acc[key] = { income: 0, expenses: 0 };
      }

      if (transaction.type === "DEPOSIT") {
        acc[key].income += transaction.amount;
      } else if (transaction.type === "WITHDRAWAL") {
        acc[key].expenses += Math.abs(transaction.amount); // Treat as positive value for chart display
      }

      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    const labels = Object.keys(groupedData);
    const incomeData = labels.map((label) => groupedData[label].income);
    const expenseData = labels.map((label) => groupedData[label].expenses);

    return { labels, incomeData, expenseData };
  };

  const filteredTransactions = filterTransactionsByTimeRange(selectedAccountId);
  const { labels, incomeData, expenseData } =
    groupTransactions(filteredTransactions);

  // Calculate total income and expenses across all periods
  const totalIncome = incomeData.reduce((acc, value) => acc + value, 0);
  const totalExpenses = expenseData.reduce((acc, value) => acc + value, 0);

  // Calculate cash flow percentage (positive if income > expenses, negative otherwise)
  const cashFlow = totalIncome - totalExpenses;
  const cashFlowPercentage = (cashFlow / totalIncome) * 100 || 0; // Prevent division by zero

  // Get cumulative balance only if a specific account is selected (not "All accounts")
  const cumulativeData =
    selectedAccountId !== "all"
      ? computeCumulativeBalance(filteredTransactions)
      : [];

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleAccountChange = (event: SelectChangeEvent<number | "all">) => {
    setSelectedAccountId(event.target.value as number | "all");
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    http("DELETE", `bank-accounts/account/${selectedAccountId}`)
      .then(async (response) => {
        setConfirmDelete(false);
        setSelectedAccountId("all");
        fetchBankAccounts(); // Refresh bank accounts
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessage = "Delete Account Failed. Please try again.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        console.error(errorMessage);
        alert(errorMessage); // Alert the user
      });
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Account Overview
          </Typography>
          <Link href="/add_transaction" passHref>
            <Button variant="contained" color="primary">
              Add Transaction
            </Button>
          </Link>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1">Select Account:</Typography>
          <Select
            value={selectedAccountId}
            onChange={handleAccountChange}
            sx={{
              minWidth: 200,
              color: "text.primary",
              backgroundColor: "background.paper",
            }}
          >
            <MenuItem value="all">All Accounts</MenuItem>
            {bankAccounts.map((account: BankAccount) => (
              <MenuItem key={account.id} value={account.id}>
                {account.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Time Range Selection */}
        <ButtonGroup
          variant="contained"
          aria-label="time range selection"
        >
          <Button onClick={() => handleTimeRangeChange("Last Month")}>
            Last Month
          </Button>
          <Button onClick={() => handleTimeRangeChange("Last 6 Months")}>
            Last 6 Months
          </Button>
          <Button onClick={() => handleTimeRangeChange("Last Year")}>
            Last Year
          </Button>
          <Button onClick={() => handleTimeRangeChange("All")}>All</Button>
        </ButtonGroup>
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
        {/* Income/Expense Bar Chart */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Income vs Expenses</Typography>
          <BarChart
            xAxis={[{ scaleType: "band", data: labels }]}
            series={[
              {
                data: incomeData,
                label: "Income",
                color: "#66bb6a",
              },
              {
                data: expenseData,
                label: "Expenses",
                color: "#e57373",
              },
            ]}
            width={500}
            height={300}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "16px",
              backgroundColor: "#fafafa",
              padding: "8px",
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>

        {/* Balance Line Chart */}
        {selectedAccountId !== "all" && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Balance Over Time</Typography>
            <LineChart
              xAxis={[{
                scaleType: "time",
                data: cumulativeData.map((d) => d.x),
                valueFormatter: (value) => new Date(value).toLocaleDateString(),
              }]}
              series={[{
                data: cumulativeData.map((d) => d.y),
                label: "Balance Change Over Time",
                color: "#1976d2",
              }]}
              width={500}
              height={300}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                backgroundColor: "#fff",
                padding: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Box>
        )}
      </Box>

      {/* Cash Flow Section */}
      <Box sx={{ 
        mb: 4, 
        p: 3, 
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Cash Flow Analysis</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Cash Flow: {Math.abs(cashFlowPercentage).toFixed(2)}%
          </span>
          <Box sx={{ ml: 1 }}>
            {cashFlow > 0 ? (
              <span style={{ color: "green", fontSize: "24px" }}>⬆</span>
            ) : (
              <span style={{ color: "red", fontSize: "24px" }}>⬇</span>
            )}
          </Box>
        </Box>
      </Box>

      {/* Actions Section */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2 
      }}>
        <Link href="/create_bank_account" passHref>
          <Button variant="contained" color="primary" fullWidth>
            Create Bank Account
          </Button>
        </Link>
        
        <Link href="/modify_bank_account" passHref>
          <Button variant="contained" color="primary" fullWidth>
            Modify Bank Account
          </Button>
        </Link>

        {!confirmDelete ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteClick}
            fullWidth
          >
            Delete Bank Account
          </Button>
        ) : (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography sx={{ mb: 1 }}>
              Are you sure you want to delete this bank account?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {isLoggedIn && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Link href="/expenses_collection" passHref>
              <Button variant="contained" color="primary" fullWidth>
                Manage Expenses ({expenses.length})
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AccountFlowGraph;
