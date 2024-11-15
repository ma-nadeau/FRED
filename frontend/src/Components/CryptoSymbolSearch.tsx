import React, { useState, useEffect } from 'react';

interface SymbolSearchProps {
  onSymbolSelect: (symbol: string) => void;
}

const CryptoSymbolSearch: React.FC<SymbolSearchProps> = ({ onSymbolSelect }) => {
  const [query, setQuery] = useState('');
  const [cryptoSymbols, setCryptoSymbols] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch and parse the CSV file for cryptocurrency symbols
  useEffect(() => {
    const fetchCryptoSymbols = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://www.alphavantage.co/digital_currency_list/');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const symbols: string[] = [];

        lines.forEach((line) => {
          const [symbol] = line.split(',');
          if (symbol) {
            symbols.push(symbol.trim().toUpperCase());
          }
        });

        setCryptoSymbols(symbols);
      } catch (error) {
        console.error('Error fetching crypto symbols:', error);
      }
      setIsLoading(false);
    };

    fetchCryptoSymbols();
  }, []);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = cryptoSymbols.filter((symbol) =>
      symbol.startsWith(query.toUpperCase())
    );
    setFilteredSuggestions(filtered);
  }, [query, cryptoSymbols]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a crypto symbol (e.g., BTC)"
        className="border p-2 rounded w-full"
      />
      {isLoading && <p>Loading crypto symbols...</p>}
      
      {filteredSuggestions.length > 0 && (
        <ul className="border rounded mt-2 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                setQuery(suggestion); // Set query to selected symbol
                onSymbolSelect(suggestion); // Trigger selection
                setFilteredSuggestions([]); // Clear suggestions after selection
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CryptoSymbolSearch;
