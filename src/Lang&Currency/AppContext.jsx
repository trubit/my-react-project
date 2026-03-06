// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import getCurrency from "../api/currencyApi";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en",
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD",
  );
  const [rates, setRates] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState(null);

  // Fetch rates once
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await getCurrency();
        if (!res.ok) throw new Error("Failed to fetch rates");
        const data = await res.json();
        setRates(data.rates);
      } catch (err) {
        setRatesError(err.message);
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
    // Trigger Google Translate change
    const select = document.querySelector("#google_translate_element select");
    if (select) {
      select.value = language;
      select.dispatchEvent(new Event("change"));
    }
  }, [language]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
    localStorage.setItem("currency", currency);
  }, [language, currency]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        rates,
        ratesLoading,
        ratesError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
