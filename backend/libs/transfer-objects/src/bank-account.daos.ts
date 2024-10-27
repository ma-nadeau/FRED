import { AccountType, Transaction, MainAccountType } from '@prisma/client';

export class BankAccountDAO {
  id: number;
  name: string;
  type: AccountType;
  balance?: number;
  interestRate?: number;
  transactions: Transaction[];
  account: {
    id: number;
    userId: number;
    type: MainAccountType;
    institution: string;
  };
}