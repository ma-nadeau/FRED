export class TransactionResponseDto {
  id: number;
  description: string;
  type: string;
  category: string;
  transactionAt: Date;
  amount: number;
  accountId: number;
}
