import { currencyAxios } from "./axiosInstance";

// Fetch latest currency rates against USD.
const getCurrency = () => {
  return currencyAxios.get("/latest?from=USD");
};

export default getCurrency;
