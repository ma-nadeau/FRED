import React, { useState, useEffect } from 'react';
import http from '../../lib/http';

interface BankAccount {
  id: number;
  name: string;
  balance: number;
  transactions: Transaction[];
}

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

export const fetchBankAccounts = async (): Promise<BankAccount[]> => {
  const response = await http('GET', '/bank-accounts');
  return response.data.map((account: any) => ({
    id: account.id,
    name: account.name,
    balance: account.balance,
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
};

const DisplayBankAccounts: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const accounts = await fetchBankAccounts();
        setBankAccounts(accounts);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {bankAccounts.map((account) => (
        <div key={account.id}>
          <h2>{account.name}</h2>
          <p>Balance: {account.balance}</p>
          <h3>Transactions:</h3>
          <ul>
            {account.transactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.amount} - {transaction.category} - {new Date(transaction.transactionAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DisplayBankAccounts;