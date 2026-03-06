// src/components/TrusonCoins.jsx
import { useState, useEffect } from "react";

function TrusonCoins() {
  const [price, setPrice] = useState(4.2774); // start price like Tron
  const [change24h, setChange24h] = useState(5.0); // start 24h change
  const [volume, setVolume] = useState(1082094543); // start volume

  useEffect(() => {
    const interval = setInterval(() => {
      // Price changes every 4–8 seconds (random interval for realism)
      const randomDelay = Math.floor(Math.random() * 4000) + 4000; // 4–8 seconds

      // Small realistic price movement (±0.3% to ±1.5%)
      const changePercent = (Math.random() * 3 - 1.5) / 100;
      const newPrice = Math.max(0.01, price * (1 + changePercent)); // don't go negative

      // 24h change updates smoothly
      const newChange = change24h + changePercent * 100 * 0.9; // slight decay

      // Volume increases slowly
      const volumeIncrease = Math.floor(Math.random() * 5000000) + 1000000;
      const newVolume = volume + volumeIncrease;

      setPrice(newPrice);
      setChange24h(newChange);
      setVolume(newVolume);

      // Clear and restart interval for variable timing
      clearInterval(interval);
      setTimeout(() => {}, randomDelay); // simulate variable speed
    }, 24000); // average ~6 seconds

    return () => clearInterval(interval);
  }, [price, change24h, volume]);

  const isPositive = change24h > 0;
  return (
    <tr>
      <td>TRUSON</td>
      <td>${price.toFixed(4)}</td>
      <td className={isPositive ? "text-success" : "text-danger"}>
        {change24h > 0 ? "+" : ""}
        {change24h.toFixed(2)}%
      </td>
      <td>{volume.toLocaleString()}</td>
    </tr>
  );
}

export default TrusonCoins;
