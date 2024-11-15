import React, { useState, useEffect } from 'react';
import { fetchSymbolSuggestions } from '../services/financeApi';
interface SymbolSearchProps {
  onSymbolSelect: (symbol: string) => void;
}
const StockSymbolSearch: React.FC<SymbolSearchProps> = ({ onSymbolSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      setIsLoading(true);
      const results = await fetchSymbolSuggestions(query, 'stock');
      console.log('Fetched suggestions:', results); // Log suggestions
      setSuggestions(results);
      setIsLoading(false);
    };
    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a stock symbol (e.g., AAPL)"
        className="border p-2 rounded w-full"
      />
      {isLoading && <p>Loading...</p>}
      <ul className="border rounded mt-2 max-h-48 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={() => onSymbolSelect(suggestion['1. symbol'])}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {suggestion['1. symbol']} - {suggestion['2. name']}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default StockSymbolSearch;