import React, { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Box, Snackbar, Select, MenuItem, InputLabel, FormControl, IconButton, SvgIcon } from '@mui/material';
import Link from 'next/link';
import http from '@fred/lib/http';

function DisplayExpenses() {
    const [data, setData] = useState<Transaction[]>([]);

    interface Transaction{
        accountID: number;
        amount: number;
        category: string;
        description: string;
        id: number;
        recurringCashFlowID: number;
        recurringCashFlowName: string;
        transactionAt: Date
        type: string;
    }

    useEffect(() => {
        async function fetchData() {
            try{
                const response =  await http('GET', '/bank-accounts');
                let data:any[] = response.data.map((account:any) => account.transactions).reduce((acc:any, transactions:any) => acc.concat(transactions), []);
                const transactions: Transaction[] = data.map((item:any) => ({
                    accountID: item.accountId,
                    amount: item.amount,
                    category: item.category,
                    description: item.description,
                    id: item.id,
                    recurringCashFlowID: item.recurringCashFlowID,
                    recurringCashFlowName: item.recurringCashFlowName,
                    transactionAt: item.transactionAt,
                    type: item.type
                }));
                let expenses = transactions.filter((item) => {return item.type==='WITHDRAWAL'});
                setData(expenses);
            }
            catch(error){
                console.log(error);
            }
        }

        fetchData();
    }, []);

    const filterByBankAccountID = (accountID:number): Transaction[] => {
        let filteredExpenses = data.filter((item) => {return item.accountID===accountID});
        return filteredExpenses;
    }

    const filterByCategory = (category:string): Transaction[] => {
        let filteredExpenses = data.filter((item) => {return item.category===category});
        return filteredExpenses;
    }

    return(
     <>
        {console.log(filterByBankAccountID(3))}
        {console.log(filterByCategory('HEALTH'))}
     </>
   );
}

export default DisplayExpenses;