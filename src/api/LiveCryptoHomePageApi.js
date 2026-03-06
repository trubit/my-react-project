import { coingeckoAxios } from "./axiosInstance";

export const getCoinsData = (MAIN_COIN) => {
  return coingeckoAxios.get(
    `/coins/${MAIN_COIN}?localization=false&tickers=false&market_data=true`,
  );
};

export const getCoinsList = (COINS) => {
  return coingeckoAxios.get(
    `/coins/markets?vs_currency=usd&ids=${COINS.join(",")}&order=market_cap_desc`,
  );
};

export const getGlobalStats = () => {
  return coingeckoAxios.get("/global");
};
