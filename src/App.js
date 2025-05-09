import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');
  const [macroData, setMacroData] = useState({});

  const fetchStockData = async () => {
    const apiKey = 'QMJHX5F5AHAIXFUN'; // Replace with your stock API key
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data["Global Quote"] && data["Global Quote"]["01. symbol"]) {
        setStockData(data["Global Quote"]);
        setError('');
      } else {
        setStockData(null);
        setError('No data found. Try a valid stock symbol like AAPL or MSFT.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  const fetchEconomicData = async (seriesId) => {
    const apiKey = '79c85c2228190506c3343cd7c5b6651c '; // Replace with your FRED API key
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.observations[0]?.value;
    } catch (error) {
      console.error(`Error fetching ${seriesId}:`, error);
      return 'N/A';
    }
  };

  useEffect(() => {
    const getMacroData = async () => {
      const inflation = await fetchEconomicData('CPIAUCSL');
      const unemployment = await fetchEconomicData('UNRATE');
      const gdp = await fetchEconomicData('GDP');
      const interestRate = await fetchEconomicData('FEDFUNDS');

      setMacroData({ inflation, unemployment, gdp, interestRate });
    };

    getMacroData();
  }, []);

  return (
    <div className="App">
      <h1>Stock Insight Builder</h1>
      <p>Enter a stock symbol to get the latest market data and explore related economic indicators.</p>
      <input
        type="text"
        placeholder="Enter stock symbol (e.g. AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
      />
      <button onClick={fetchStockData}>Get Stock Info</button>

      {error && <p className="error">{error}</p>}

      {stockData && (
        <div className="stock-info">
          <h2>{symbol} Details</h2>
          <p><strong>Symbol:</strong> {stockData["01. symbol"]}</p>
          <p><strong>Price:</strong> ${stockData["05. price"]}</p>
          <p><strong>Open:</strong> ${stockData["02. open"]}</p>
          <p><strong>High:</strong> ${stockData["03. high"]}</p>
          <p><strong>Low:</strong> ${stockData["04. low"]}</p>
          <p><strong>Previous Close:</strong> ${stockData["08. previous close"]}</p>
          <p><strong>Change:</strong> {stockData["09. change"]}</p>
          <p><strong>Change Percent:</strong> {stockData["10. change percent"]}</p>
          <p><strong>Volume:</strong> {stockData["06. volume"]}</p>
          <p><strong>Latest Trading Day:</strong> {stockData["07. latest trading day"]}</p>
        </div>
      )}

      <div className="macro-info">
        <h2>Macroeconomic Indicators</h2>
        <p><strong>Inflation (CPI):</strong> {macroData.inflation}</p>
        <p><strong>Unemployment Rate:</strong> {macroData.unemployment}%</p>
        <p><strong>GDP:</strong> {macroData.gdp} (Billions USD)</p>
        <p><strong>Federal Funds Rate:</strong> {macroData.interestRate}%</p>
      </div>
    </div>
  );
}

export default App;
