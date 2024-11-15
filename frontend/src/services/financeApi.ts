import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;


  /**
   * Fetch stock symbol suggestions from Alpha Vantage API.
   * @param query - The search query.
   * @returns A promise that resolves to an array of stock symbol suggestions.
   */
  export async function fetchStockSymbolSuggestions(query: string): Promise<any[]> {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;

    try {
      const response = await axios.get(url);
      const results = response.data.bestMatches || [];
      return results.map((suggestion: any) => ({
        symbol: suggestion['1. symbol'],
        name: suggestion['2. name'],
      }));
    } catch (error) {
      console.error('Error fetching stock symbol suggestions:', error);
      return [];
    }
  }
  /**
   * Fetch and filter cryptocurrency symbols.
   * @param query - The search query.
   * @returns A promise that resolves to an array of filtered cryptocurrency symbols.
   */
  export async function fetchCryptoSymbolSuggestions(query: string): Promise<string[]> {
    try {
      // Fetch the CSV data
      const response = await fetch('https://www.alphavantage.co/digital_currency_list/');
      const csvText = await response.text();

      // Parse the CSV data
      const lines = csvText.split('\n');
      const symbols: string[] = lines.map((line) => line.split(',')[0].trim().toUpperCase());

      // Filter suggestions based on the query
      if (query.length < 1) {
        return [];
      }
      return symbols.filter((symbol) => symbol.startsWith(query.toUpperCase()));
    } catch (error) {
      console.error('Error fetching crypto symbols:', error);
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
