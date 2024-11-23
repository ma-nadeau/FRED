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
import Link from 'next/link';
import {
  exampleAccountFlowData,
  Transaction,
  BankAccount,
} from "../types/AccountFlowData"; // Import the example data
import http from '@fred/lib/http';



const AccountFlowGraph: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("Last Month");
  const [selectedAccountId, setSelectedAccountId] = useState<number | "all">(
    "all"
  );
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(window.localStorage.getItem('token')!==null);
  }, []);

  // Get all transactions from the exampleAccountFlowData
  const transactions = exampleAccountFlowData.bankAccounts.flatMap(
    (account) => account.transactions
  );


  // Utility function to get transactions for a specific account or all accounts
  const getTransactionsForAccount = (
    accountId: number | "all"
  ): Transaction[] => {
    if (accountId === "all") {
      return transactions;
    }
    return (
      exampleAccountFlowData.bankAccounts.find(
        (account) => account.id === accountId
      )?.transactions || []
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
  const filterTransactionsByTimeRange = (accountId: number | "all"): Transaction[] => {
    const accountTransactions = getTransactionsForAccount(accountId);
    const startDate = getStartDateForRange(timeRange);

    // Ensure sorting by transaction date from oldest to newest
    return accountTransactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.transactionAt);
        return transactionDate >= startDate;
      })
      .sort((a, b) => new Date(a.transactionAt).getTime() - new Date(b.transactionAt).getTime()); // Ensure transactions are sorted by date
  };

  // Compute cumulative balance over time for line chart
  const computeCumulativeBalance = (transactions: Transaction[]): { x: number; y: number }[] => {
    let cumulativeBalance = 0;
    const dataPoints: { x: number; y: number }[] = [];

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.transactionAt).getTime(); // Timestamp for x-axis
      cumulativeBalance += transaction.type === "DEPOSIT" ? transaction.amount : -transaction.amount;
      dataPoints.push({ x: transactionDate, y: cumulativeBalance });
    });

    // Add current date as last point on line chart, with the same balance as the last transaction
    const currentDate = new Date().getTime();
    if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1].x !== currentDate) {
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
  const cumulativeData = selectedAccountId !== "all" ? computeCumulativeBalance(filteredTransactions) : [];

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

    http('DELETE', `bank-accounts/account/${selectedAccountId}`)
      .then(async (response) => {})
      .catch((error) => {
        console.error('Error:', error);
        let errorMessage = 'Delete Account Failed. Please try again.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        console.error(errorMessage);
        alert(errorMessage); // Add alert for the user
      });
  };

  
  const handleCancelDelete = () => {
    setConfirmDelete(false); 
  };

  const getExpenses = () => {
    const expenses = new Array();
    //const [data, setData] = useState<any[]>([]);
    if(isLoggedIn){
      http('GET', '/bank-accounts')
        .then(async (response) => {
            if(response.data){
              response.data.forEach( (bankAccount:any) => {
                if(bankAccount.transactions.length>0){
                  bankAccount.transactions.forEach( (transaction:any) => {
                    if(transaction.type === "WITHDRAWAL"){
                      expenses.push(transaction);
                    }
                  })
                }
              });
            }
            else{
              console.error('No bank accounts exist')
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    console.log(expenses);
    return expenses;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Account:
      </Typography>
      <Select
        value={selectedAccountId}
        onChange={handleAccountChange}
        sx={{ mb: 2, color: "text.primary", backgroundColor: "background.paper" }}
      >
        <MenuItem value="all">All Accounts</MenuItem>
        {exampleAccountFlowData.bankAccounts.map((account: BankAccount) => (
          <MenuItem key={account.id} value={account.id}>
        {account.name}
          </MenuItem>
        ))}
      </Select>

      <BarChart
        xAxis={[{ scaleType: "band", data: labels }]}
        series={[
          { data: incomeData, label: "Income", color: "green" },
          { data: expenseData, label: "Expenses", color: "red" },
        ]}
        width={500}
        height={300}
      />

      {/* Line Chart for cumulative balance */}
      {selectedAccountId !== "all" && (
        <LineChart
          xAxis={[
            {
              scaleType: 'time',
              data: cumulativeData.map((d) => d.x),
              valueFormatter: (value) => new Date(value).toLocaleDateString(), // Format timestamp into readable date
            },
          ]}
          series={[
            {
              data: cumulativeData.map((d) => d.y),
              label: "Balance Over Time",
            },
          ]}
          width={500}
          height={300}
        />
      )}

      {/* Cash Flow Percentage Display */}
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Box>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            Cash Flow: {Math.abs(cashFlowPercentage).toFixed(2)}%
          </span>
        </Box>
        <Box sx={{ ml: 1 }}>
          {cashFlow > 0 ? (
            <span style={{ color: "green", fontSize: "24px" }}>⬆</span> // Green up arrow
          ) : (
            <span style={{ color: "red", fontSize: "24px" }}>⬇</span> // Red down arrow
          )}
        </Box>
      </Box>

      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        sx={{ mt: 2 }}
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

      {/* Create Bank Account button */}
      <Box sx={{ mt: 2 }}>
        <Link href="/create_bank_account" passHref>
          <Button
            variant="contained"
            color="primary"
          >
            Create Bank Account
          </Button>
        </Link>
      </Box>

      {/* Modify Bank Account button */}
      <Box sx={{ mt: 2 }}>
        <Link href="/modify_bank_account" passHref>
          <Button
            variant="contained"
            color="primary"
          >
            Modify Bank Account
          </Button>
        </Link>
      </Box>

      {/* Delete Bank Account button */}
      <Box sx={{ mt: 2 }}>
        {!confirmDelete ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteClick}
          >
            Delete Bank Account
          </Button>
        ) : (
          <Box>
            <Typography>Are you sure you want to delete this bank account?</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
              sx={{ mr: 1 }}
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
        )}
      </Box>
      
      {/* Manage expenses button */}
      {isLoggedIn && 
        <Box sx={{ mt: 2 }}>
          <Link href="/expenses_collection" passHref>
            <Button
              variant="contained"
              color="primary"
            >
              Manage Expenses
            </Button>
          </Link>
          
          <h1>{getExpenses()}</h1>
        </Box>
      }
    </Box>

  );
};

export default AccountFlowGraph;