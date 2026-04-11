import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

const TRUSON_ASSET = "TRUSON";
// Helper to find or create a TrusonCoin wallet for a user.
const getOrCreateWallet = async (userId) => {
  const existing = await Wallet.findOne({ user: userId, asset: TRUSON_ASSET });
  if (existing) return existing;
  return Wallet.create({
    user: userId,
    asset: TRUSON_ASSET,
    balance: 0,
    available: 0,
    locked: 0,
  });
};
// Helper to validate and parse a positive number from input.
const parseAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  return amount;
};

// Get the logged-in user's TrusonCoin wallet + recent activity.
export const getTrusonWallet = async (req, res) => {
  const wallet = await getOrCreateWallet(req.user.id);
  const transactions = await Transaction.find({
    user: req.user.id,
    asset: TRUSON_ASSET,
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ wallet, transactions });
};

// User: spend TrusonCoins from their own wallet.
export const spendTrusonCoins = async (req, res) => {
  const { amount, note = "" } = req.body;
  const parsedAmount = parseAmount(amount);
  if (!parsedAmount) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number." });
  }
  // NOTE: In a real app, you would also want to validate the note length and content to prevent abuse.
  const wallet = await getOrCreateWallet(req.user.id);
  if (wallet.available < parsedAmount) {
    return res
      .status(400)
      .json({ message: "Insufficient TrusonCoins balance." });
  }
  // NOTE: For simplicity, we directly deduct from balance and available. In a real app, consider using transactions or locks
  wallet.balance -= parsedAmount;
  wallet.available -= parsedAmount;
  await wallet.save();
  // NOTE: Record the spend as a completed transaction. In a real app, you might want to have a pending state until the spend is fully processed.
  const transaction = await Transaction.create({
    user: req.user.id,
    type: "withdrawal",
    asset: TRUSON_ASSET,
    amount: parsedAmount,
    status: "completed",
    note,
  });

  res.status(201).json({ wallet, transaction });
};
