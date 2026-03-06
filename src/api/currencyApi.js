import { currencyAxios } from "./axiosInstance";

const getCurrency = () => {
  return currencyAxios.get("/latest?from=USD");
};

export default getCurrency;
