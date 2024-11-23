export class TradingTransactionResponseDto {
  id: number;
  tradingAccountId: number;
  symbol: string;
  purchasePrice?: number;
  sellPrice?: number;
  quantity: number;
  transactionAt: Date;
  tradingAccount: {
    id: number;
  };
}
