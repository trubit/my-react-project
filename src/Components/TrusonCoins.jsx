// src/components/TrusonCoins.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchCoins } from "../api/coins";

// Live row for TrusonCoin (from backend catalog).
const TrusonCoins = () => {
  const [coin, setCoin] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchCoins()
      .then((data) => {
        if (!isMounted) return;
        const found = data?.coins?.find((c) => c.symbol === "TRUSON");
        setCoin(found || null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Unable to load TrusonCoin.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatted = useMemo(() => {
    if (!coin) return null;
    const price = Number(coin.priceUsd || 0);
    const change24h = Number(coin.change24h || 0);
    const volume24h = Number(coin.volume24h || 0);
    return { price, change24h, volume24h, isPositive: change24h > 0 };
  }, [coin]);

  if (error) {
    return (
      <tr>
        <td colSpan={4} className="text-danger">
          {error}
        </td>
      </tr>
    );
  }

  if (!formatted) {
    return (
      <tr>
        <td>TRUSON</td>
        <td>Loading...</td>
        <td>--</td>
        <td>--</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>TRUSON</td>
      <td>${formatted.price.toFixed(4)}</td>
      <td className={formatted.isPositive ? "text-success" : "text-danger"}>
        {formatted.change24h > 0 ? "+" : ""}
        {formatted.change24h.toFixed(2)}%
      </td>
      <td>{formatted.volume24h.toLocaleString()}</td>
    </tr>
  );
};

export default TrusonCoins;
