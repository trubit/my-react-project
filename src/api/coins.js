const API_BASE_URL =
  import.meta.env.VITE_TRUSON_API_URL ||
  import.meta.env.VITE_API_URL ||
  "";

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const fetchCoins = async () => {
  const response = await fetch(`${API_BASE_URL}/api/coins`);
  const payload = await parseJson(response);
  if (!response.ok) {
    const message = payload?.message || "Unable to fetch coins";
    throw new Error(message);
  }
  return payload;
};
