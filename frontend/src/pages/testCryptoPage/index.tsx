import React, { useState } from 'react';
import CryptoSymbolSearch from '../../Components/CryptoSymbolSearch';
import { fetchPrice } from '../../services/financeApi';

const TestCryptoPage: React.FC = () => {
  const [selectedCryptoSymbol, setSelectedCryptoSymbol] = useState<string | null>(null);
  const [cryptoPrice, setCryptoPrice] = useState<number | null>(null);

  const handleCryptoSelect = async (symbol: string) => {
    setSelectedCryptoSymbol(symbol);
    const price = await fetchPrice(symbol, 'crypto');
    setCryptoPrice(price);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Crypto Symbol Search</h1>
      
      <CryptoSymbolSearch onSymbolSelect={handleCryptoSelect} />
      
      {selectedCryptoSymbol && (
        <p className="mt-2">
          Selected Crypto: {selectedCryptoSymbol} - Price: {cryptoPrice !== null ? `$${cryptoPrice.toFixed(2)}` : 'Loading...'}
        </p>
      )}
    </div>
  );
};

export default TestCryptoPage;
