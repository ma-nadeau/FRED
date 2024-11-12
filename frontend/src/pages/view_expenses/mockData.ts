// mockData.ts

export interface Transaction {
  id: number;
  accountId: number;
  amount: number;
  transactionAt: string;
  type: string;
  category: string;
  description?: string;
}

export interface BankAccount {
  id: number;
  name: string;
  type: string;
}

export const mockBankAccounts: BankAccount[] = [
  { id: 1, name: 'Checking Account', type: 'CHECKING' },
  { id: 2, name: 'Savings Account', type: 'SAVINGS_TFSA' },
];

export const mockTransactions: Transaction[] = [
  { id: 1, accountId: 1, amount: 50, transactionAt: '2023-12-01', type: 'DEPOSIT', category: 'GROCERIES', description: 'Grocery shopping' },
  { id: 2, accountId: 1, amount: 100, transactionAt: '2023-11-15', type: 'DEPOSIT', category: 'RENT', description: 'Monthly rent' },
  { id: 3, accountId: 1, amount: 100, transactionAt: '2023-11-16', type: 'DEPOSIT', category: 'RENT', description: 'Monthly rent' },
  { id: 4, accountId: 2, amount: 200, transactionAt: '2023-07-20', type: 'WITHDRAWAL', category: 'CAR', description: 'Car repair' },
  { id: 5, accountId: 2, amount: 150, transactionAt: '2023-06-10', type: 'WITHDRAWAL', category: 'BILLS', description: 'Utility bills' },
];

export const TransactionCategory = {
  GROCERIES: 'GROCERIES',
  CAR: 'CAR',
  RENT: 'RENT',
  TUITION: 'TUITION',
  BILLS: 'BILLS',
  HEALTH: 'HEALTH',
  MISCELLANEOUS: 'MISCELLANEOUS',
  OUTINGS: 'OUTINGS',
};