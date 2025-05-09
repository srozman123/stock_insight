import React, { useState } from 'react';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);

  const fetchStockData = async () => {
    const apiKey = '79c85c2228190506c3343cd7c5b6651c '; // Replace with your real API key
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setStockData(data["Global Quote"]);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Stock Insight Builder</h1>
      <input
        type="text"
        placeholder="Enter stock symbol (e.g. AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
      />
      <button onClick={fetchStockData}>Get Stock Info</button>

      {stockData && (
        <div className="stock-info">
          <h2>{symbol} Details</h2>
          <p><strong>Price:</strong> ${stockData["05. price"]}</p>
          <p><strong>Change:</strong> {stockData["10. change percent"]}</p>
          <p><strong>Volume:</strong> {stockData["06. volume"]}</p>
        </div>
      )}
    </div>
  );
}

export default App;

