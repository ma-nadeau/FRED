export interface Transaction {
    id: number;
    accountId: number;
    amount: number;
    transactionAt: string; // ISO 8601 date format as a string
    type: 'DEPOSIT' | 'WITHDRAWAL'; // Matches TransactionType enum from the schema
    description?: string; // Optional, as it was in your schema
  }
  
  export interface BankAccount {
    id: number;
    type: 'CHECKING' | 'SAVINGS_TFSA' | 'SAVINGS_RRSP' | 'SAVINGS_TFSH' | 'CREDIT'; // Matches AccountType enum
    name: string;
    balance: number;
    interestRate: number;
    transactions: Transaction[]; // List of transactions related to the bank account
  }
  
  export interface AccountFlowData {
    accountId: number;
    accountName: string;
    totalBalance: number;
    bankAccounts: BankAccount[]; // List of bank accounts associated with the user
  }
  
  export const exampleAccountFlowData: AccountFlowData = {
    accountId: 123,
    accountName: "Main Checking Account",
    totalBalance: 10000.0,
    bankAccounts: [
      {
        id: 1,
        type: "CHECKING",
        name: "Main Checking",
        balance: 5000.0,
        interestRate: 0.0,
        transactions: [
          // Last Month (current month - 1)
          {
            id: 1,
            accountId: 1,
            amount: 2000.0,
            transactionAt: "2024-09-01T00:00:00.000Z", // Income
            type: "DEPOSIT",
            description: "Salary",
          },
          {
            id: 2,
            accountId: 1,
            amount: -100.0,
            transactionAt: "2024-09-05T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Groceries",
          },
          {
            id: 3,
            accountId: 1,
            amount: -500.0,
            transactionAt: "2024-09-10T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Rent",
          },
          // Last 6 Months
          {
            id: 4,
            accountId: 1,
            amount: 3000.0,
            transactionAt: "2024-06-15T00:00:00.000Z", // Income
            type: "DEPOSIT",
            description: "Bonus",
          },
          {
            id: 5,
            accountId: 1,
            amount: -200.0,
            transactionAt: "2024-07-01T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Utilities",
          },
          {
            id: 6,
            accountId: 1,
            amount: -150.0,
            transactionAt: "2024-07-10T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Dining",
          },
          // Last Year
          {
            id: 7,
            accountId: 1,
            amount: 1500.0,
            transactionAt: "2024-01-20T00:00:00.000Z", // Income
            type: "DEPOSIT",
            description: "Freelance Payment",
          },
          {
            id: 8,
            accountId: 1,
            amount: -300.0,
            transactionAt: "2024-03-01T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Groceries",
          },
          {
            id: 9,
            accountId: 1,
            amount: -1000.0,
            transactionAt: "2024-02-15T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Car Payment",
          },
          // Multiple Years for "All"
          {
            id: 10,
            accountId: 1,
            amount: 2500.0,
            transactionAt: "2023-11-20T00:00:00.000Z", // Income
            type: "DEPOSIT",
            description: "Freelance Payment",
          },
          {
            id: 11,
            accountId: 1,
            amount: -1200.0,
            transactionAt: "2022-10-01T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Laptop Purchase",
          },
          {
            id: 12,
            accountId: 1,
            amount: -800.0,
            transactionAt: "2022-12-05T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Vacation",
          },
          // Today
          {
            id: 13,
            accountId: 1,
            amount: 2000.0,
            transactionAt: "2024-10-01T00:00:00.000Z", // Income
            type: "DEPOSIT",
            description: "Salary",
          },
        ],
      },
      {
        id: 2,
        type: "SAVINGS_TFSA",
        name: "Savings Account",
        balance: 5000.0,
        interestRate: 2.5,
        transactions: [
          {
            id: 13,
            accountId: 2,
            amount: 1000.0,
            transactionAt: "2024-07-22T00:00:00.000Z", // Income
            type: "DEPOSIT",
            description: "Interest",
          },
          {
            id: 14,
            accountId: 2,
            amount: -500.0,
            transactionAt: "2024-05-30T00:00:00.000Z", // Expense
            type: "WITHDRAWAL",
            description: "Investment Withdrawal",
          },
        ],
      },
    ],
  };
  