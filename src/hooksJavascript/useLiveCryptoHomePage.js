import { useState, useEffect } from "react";
import {
  getCoinsData,
  getCoinsList,
  getGlobalStats,
} from "../api/LiveCryptoHomePageApi";
import { Spinner } from "react-bootstrap";

const MAIN_COIN = "solana"; // Main coin (SOL)
const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "ripple",
  "cardano",
  "dogecoin",
  "polkadot",
  "chainlink",
  "litecoin",
  "avalanche-2",
  "polygon",
  "shiba-inu",
  "tron",
  "bitcoin-cash",
  "uniswap",
  "cosmos",
  "stellar",
  "near",
  "ethereum-classic",
  "filecoin", // 21 coins
];

function useLiveCryptoHomePage() {
  const [ticker, setTicker] = useState({});
  const [marketCap, setMarketCap] = useState("Loading...");
  const [tradingVolume, setTradingVolume] = useState("Loading...");
  const [exchangeTickers, setExchangeTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  // CoinGecko API polling for main coin (SOL) - every 15s
  useEffect(() => {
    const fetchMainCoinData = async () => {
      try {
        const tickerRes = await getCoinsData(MAIN_COIN);
        setTicker(tickerRes.data.market_data);
      } catch (err) {
        console.error("CoinGecko main coin error:", err);
      }
    };

    fetchMainCoinData();
    const interval = setInterval(fetchMainCoinData, 15000);

    return () => clearInterval(interval);
  }, []);

  // CoinGecko API polling for different coins (exchanges list) - every 15s
  useEffect(() => {
    const fetchExchangeTickers = async () => {
      try {
        const tickersRes = await getCoinsList(COINS);
        setExchangeTickers(tickersRes.data);
      } catch (err) {
        console.error("CoinGecko exchange tickers error:", err);
      }
    };

    fetchExchangeTickers();
    const interval = setInterval(fetchExchangeTickers, 15000);

    return () => clearInterval(interval);
  }, []);

  // CoinGecko API polling for global stats (market cap & trading volume) - every 5 minutes
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const globalRes = await getGlobalStats();
        const data = globalRes.data.data;

        const mc = data.total_market_cap.usd;
        const vol = data.total_volume.usd;

        setMarketCap(
          mc >= 1e12
            ? `$${(mc / 1e12).toFixed(2)} Trillion USD`
            : mc >= 1e9
              ? `$${(mc / 1e9).toFixed(2)} Billion USD`
              : `$${mc.toLocaleString()} USD`,
        );

        setTradingVolume(
          vol >= 1e12
            ? `$${(vol / 1e12).toFixed(2)} Trillion USD`
            : vol >= 1e9
              ? `$${(vol / 1e9).toFixed(2)} Billion USD`
              : `$${vol.toLocaleString()} USD`,
        );

        setLoading(false);
      } catch (err) {
        console.error("CoinGecko global stats error:", err);
        setMarketCap("Error");
        setTradingVolume("Error");
      }
    };

    fetchGlobalStats();
    const interval = setInterval(fetchGlobalStats, 300000); // every 5 minutes

    return () => clearInterval(interval);
  }, []);

  {
    /*if (loading) {
    return (
      <Spinner
        animation="border"
        variant="success"
        className="d-block mx-auto mt-5"
      />
    );
  }*/
  }

  const price = parseFloat(ticker.current_price?.usd || 0).toFixed(2);
  const change24h = parseFloat(ticker.price_change_percentage_24h || 0).toFixed(
    2,
  );
  const volume24h = parseFloat(ticker.total_volume?.usd || 0).toLocaleString();
  const high24h = parseFloat(ticker.high_24h?.usd || 0).toFixed(2);
  const low24h = parseFloat(ticker.low_24h?.usd || 0).toFixed(2);

  const isPositive = change24h > 0;

  return {
    ticker,
    setTicker,
    marketCap,
    setMarketCap,
    tradingVolume,
    setTradingVolume,
    exchangeTickers,
    setExchangeTickers,
    loading,
    setLoading,
    high24h,
    price,
    volume24h,
    low24h,
    change24h,
    isPositive,
  };
}

export default useLiveCryptoHomePage;
