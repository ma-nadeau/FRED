import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt'; // For password hashing
import { UserDAO } from '@fred/transfer-objects/daos';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: number): Promise<UserDAO | null> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, name: true, email: true, age: true },
    });
    return user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
        }
      : null;
  }

  async create(
    name: string,
    email: string,
    age: number,
    password: string,
  ): Promise<UserDAO> {
    return this.prisma.user.create({
      data: {
        name,
        email,
        age,
        password,
      },
    });
  }

  async updateName(id: number, name: string): Promise<UserDAO> {
    return this.prisma.user.update({
      where: { id },
      data: { name },
    });
  }

  async updatePassword(id: number, password: string): Promise<UserDAO> {
    return this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return Boolean(await this.prisma.user.findUnique({ where: { email } }));
  }

  async verifyPassword(
    email: string,
    password: string,
  ): Promise<
    | {
        success: true;
        user: Omit<UserDAO, 'password'>; // Omit password in the return type
      }
    | {
        success: false;
      }
  > {
    // Fetch user including the password (temporarily)
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true, name: true, email: true, age: true, password: true }, // Include password temporarily
    });

    if (!user) {
      return { success: false };
    }

    // Compare hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false };
    }

    // Destructure password to exclude it from the response
    const { password: _, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword };
  }

  async getUserCount(): Promise<number> {
    return this.prisma.user.count();
  }
    async chatContext(
        user: UserDAO,
    ) {
        const mainAccount = await this.prisma.mainAccount.findFirstOrThrow(
            { 
                where: { userId: user.id },
                include: {
                    bankAccount: true,
                    tradingAccount: true,
                }
            });

        const transactions = await this.prisma.transaction.findMany({ where: { accountId: mainAccount.id } });
        const recurringCashFlows = await this.prisma.recurringCashFlow.findMany({ where: { accountId: mainAccount.id } });
        const tradesStockTransactions = await this.prisma.tradeStockTransaction.findMany({ where: { tradingAccountId: mainAccount.id } });


        // Build context string with user and account information
        let context = `You are a personal financial advisor with access to the user's financial information. The user is ${user.name} (${user.email}). Your role is to provide financial advice, answer questions about their accounts and transactions, and help them make informed financial decisions. Be professional but friendly in your responses.\n\n
        
        Start by introducing yourself and asking how you can assist.
        `;
            
        // Add bank account details if exists
        if (mainAccount.bankAccount) {
            context += `Bank Account "${mainAccount.bankAccount.name}":\n`;
            context += `- Type: ${mainAccount.bankAccount.type}\n`;
            context += `- Current Balance: $${mainAccount.bankAccount.balance}\n`;
            context += `- Interest Rate: ${mainAccount.bankAccount.interestRate}%\n\n`;

            // Add transaction summary
            if (transactions.length > 0) {
                context += "Recent Transactions:\n";
                transactions.slice(-5).forEach(tx => {
                    context += `- ${tx.type} of $${tx.amount} on ${tx.transactionAt.toLocaleDateString()} (${tx.category})\n`;
                });
                context += "\n";
            }

            // Add recurring cash flows
            if (recurringCashFlows.length > 0) {
                context += "Recurring Cash Flows:\n";
                recurringCashFlows.forEach(rcf => {
                    context += `- ${rcf.name}: $${rcf.amount} ${rcf.frequency} (${rcf.isActive ? 'Active' : 'Inactive'})\n`;
                });
                context += "\n";
            }
        }

        // Add trading account details if exists
        if (mainAccount.tradingAccount) {
            context += `Trading Account "${mainAccount.tradingAccount.name}":\n`;
            context += `- Type: ${mainAccount.tradingAccount.type}\n`;
            context += `- Current Balance: $${mainAccount.tradingAccount.balance}\n\n`;

            // Add stock trades summary
            if (tradesStockTransactions.length > 0) {
                context += "Recent Stock Trades:\n";
                tradesStockTransactions.slice(-5).forEach(trade => {
                    const action = trade.sellPrice ? 'Sold' : 'Bought';
                    const price = trade.sellPrice || trade.purchasePrice;
                    context += `- ${action} ${trade.quantity} shares of ${trade.symbol} at $${price} on ${trade.transactionAt.toLocaleDateString()}\n`;
                });
                context += "\n";
            }
        }

        return context;
    }
    
}
