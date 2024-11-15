import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;


export async function fetchSymbolSuggestions(query: string, type: 'stock' | 'crypto'): Promise<any[]> {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
      const results = response.data.bestMatches || [];
      
      // Filter results based on type
      if (type === 'crypto') {
        return results.filter((suggestion: any) => suggestion['1. symbol'].endsWith('USD'));
      }
      
      return results; // Return all for stocks
    } catch (error) {
      console.error('Error fetching symbol suggestions:', error);
      return [];
    }
  }

  export async function fetchPrice(symbol: string, type: 'stock' | 'crypto'): Promise<number | null> {
    let url: string;
  
    if (type === 'stock') {
      url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    } else {
      url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${API_KEY}`;
    }
  
    try {
      const response = await axios.get(url);
      if (type === 'stock') {
        const price = response.data['Global Quote']['05. price'];
        return parseFloat(price); // Return parsed price as a number
      } else {
        const price = response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
        return parseFloat(price); // Return parsed price as a number
      }
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  }
