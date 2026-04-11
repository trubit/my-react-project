import Coin from "../models/Coin.js";

// List all active coins (public).
export const listCoins = async (_req, res) => {
  const coins = await Coin.find({ isActive: true }).sort({ symbol: 1 });
  res.json({ coins });
};

// Admin: create a new coin in the catalog.
export const createCoin = async (req, res) => {
  const payload = { ...req.body };
  const coin = await Coin.create(payload);
  res.status(201).json({ coin });
};

// Admin: update coin metadata.
export const updateCoin = async (req, res) => {
  const coin = await Coin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coin) {
    return res.status(404).json({ message: "Coin not found." });
  }
  return res.json({ coin });
};
