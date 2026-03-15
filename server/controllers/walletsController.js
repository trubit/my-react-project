import Wallet from "../models/Wallet.js";

// List wallets (admins see all, users see theirs).
export const listWallets = async (req, res) => {
  const filter = req.user?.role === "admin" ? {} : { user: req.user.id };
  const wallets = await Wallet.find(filter).sort({ asset: 1 });
  res.json({ wallets });
};

// Create a wallet for the logged-in user.
export const createWallet = async (req, res) => {
  const payload = { ...req.body, user: req.user.id };
  const wallet = await Wallet.create(payload);
  res.status(201).json({ wallet });
};

// Update a wallet by ID.
export const updateWallet = async (req, res) => {
  const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found." });
  }
  return res.json({ wallet });
}; 

