import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');
  const [macroData, setMacroData] = useState({});

  const fetchStockData = async () => {
    const apiKey = 'QMJHX5F5AHAIXFUN';
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
    const apiKey = '79c85c2228190506c3343cd7c5b6651c';
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
      <header className="header">
        <h1>📈 Stock Insight Builder</h1>
        <p>Analyze stocks and see how they relate to the economy.</p>
      </header>

      <section className="search-section">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g. AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        />
        <button onClick={fetchStockData}>🔍 Get Info</button>
      </section>

      {error && <p className="error">{error}</p>}

      {stockData && (
        <section className="card">
          <h2>{symbol} Overview</h2>
          <ul>
            <li><strong>Price:</strong> ${stockData["05. price"]}</li>
            <li><strong>Open:</strong> ${stockData["02. open"]}</li>
            <li><strong>High:</strong> ${stockData["03. high"]}</li>
            <li><strong>Low:</strong> ${stockData["04. low"]}</li>
            <li><strong>Previous Close:</strong> ${stockData["08. previous close"]}</li>
            <li><strong>Change:</strong> {stockData["09. change"]} ({stockData["10. change percent"]})</li>
            <li><strong>Volume:</strong> {stockData["06. volume"]}</li>
            <li><strong>Latest Trading Day:</strong> {stockData["07. latest trading day"]}</li>
          </ul>
          <a
            href={`https://www.marketwatch.com/investing/stock/${symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="info-link"
          >
            📰 More info & news on {symbol} at MarketWatch
          </a>
        </section>
      )}

      <section className="card">
        <h2>📊 Macroeconomic Indicators</h2>
        <ul>
          <li><strong>Inflation (CPI):</strong> {macroData.inflation}</li>
          <li><strong>Unemployment Rate:</strong> {macroData.unemployment}%</li>
          <li><strong>GDP:</strong> {macroData.gdp} (Billions USD)</li>
          <li><strong>Federal Funds Rate:</strong> {macroData.interestRate}%</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
