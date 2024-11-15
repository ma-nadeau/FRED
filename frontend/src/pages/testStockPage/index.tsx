import React, { useState } from 'react';
import StockSymbolSearch from '../../Components/StockSymbolSearch';
import { fetchPrice } from '../../services/financeApi';

const TestStockPage: React.FC = () => {
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null);
  const [stockPrice, setStockPrice] = useState<number | null>(null);

  const handleStockSelect = async (symbol: string) => {
    setSelectedStockSymbol(symbol);
    const price = await fetchPrice(symbol, 'stock');
    setStockPrice(price);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Stock Symbol Search</h1>
      
      <StockSymbolSearch onSymbolSelect={handleStockSelect} />
      
      {selectedStockSymbol && (
        <p className="mt-2">
          Selected Stock: {selectedStockSymbol} - Price: {stockPrice !== null ? `$${stockPrice.toFixed(2)}` : 'Loading...'}
        </p>
      )}
    </div>
  );
};

export default TestStockPage;
