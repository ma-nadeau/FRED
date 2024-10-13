"use client"; // Ensure this component runs on the client-side

import React, { useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Button, ButtonGroup } from "@mui/material";
import { exampleAccountFlowData, Transaction } from "../types/AccountFlowData"; // Import the example data

const AccountFlowGraph: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("Last Month");

  // Get the transactions from the exampleAccountFlowData
  const transactions = exampleAccountFlowData.bankAccounts.flatMap(
    (account) => account.transactions
  );

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
const filterTransactionsByTimeRange = (): Transaction[] => {
    const startDate = getStartDateForRange(timeRange);
    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.transactionAt);
        return transactionDate >= startDate;
      })
      .sort((a, b) => new Date(a.transactionAt).getTime() - new Date(b.transactionAt).getTime()); // Sort by date
  };  

  // Utility function to format a date as "YYYY-MM" for grouping by month
  const formatMonth = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  // Utility function to format a date as "YYYY" for grouping by year
  const formatYear = (date: Date): string => {
    return `${date.getFullYear()}`;
  };

  // Function to group transactions by month or year based on the time range
  const groupTransactions = (filteredTransactions: Transaction[]): {
    labels: string[];
    incomeData: number[];
    expenseData: number[];
  } => {
    const groupedData = filteredTransactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.transactionAt);
        const key =
          timeRange === "All" ? formatYear(transactionDate) : formatMonth(transactionDate);

        if (!acc[key]) {
          acc[key] = { income: 0, expenses: 0 };
        }

        if (transaction.type === "DEPOSIT") {
          acc[key].income += transaction.amount;
        } else if (transaction.type === "WITHDRAWAL") {
          acc[key].expenses += Math.abs(transaction.amount); // Treat as positive value for chart display
        }

        return acc;
      },
      {} as Record<
        string,
        { income: number; expenses: number }
      >
    );

    const labels = Object.keys(groupedData);
    const incomeData = labels.map((label) => groupedData[label].income);
    const expenseData = labels.map((label) => groupedData[label].expenses);

    return { labels, incomeData, expenseData };
  };

  const filteredTransactions = filterTransactionsByTimeRange();
  const { labels, incomeData, expenseData } = groupTransactions(filteredTransactions);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  return (
    <Box>
      <BarChart
        xAxis={[{ scaleType: "band", data: labels }]}
        series={[
          { data: incomeData, label: "Income", color: "green" },
          { data: expenseData, label: "Expenses", color: "red" },
        ]}
        width={500}
        height={300}
      />

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
    </Box>
  );
};

export default AccountFlowGraph;
