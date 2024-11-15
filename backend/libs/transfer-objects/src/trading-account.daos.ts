import { TradingAccountType, TradeStockTransaction } from '@prisma/client';

export class TradingAccountDAO {
  id: number;
  name: string;
  type: TradingAccountType;
  balance: number;
  tradesStock: TradeStockTransaction[];
  account: {
    id: number;
    userId: number;
  };
}
