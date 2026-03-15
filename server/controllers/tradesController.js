import Trade from "../models/Trade.js";

// List trades (admins can filter by userId).
export const listTrades = async (req, res) => {
  const filter = {};
  if (req.user?.role !== "admin") {
    filter.user = req.user.id;
  } else if (req.query.userId) {
    filter.user = req.query.userId;
  }

  const trades = await Trade.find(filter).sort({ createdAt: -1 });
  res.json({ trades });
};

// Fetch one trade by ID.
export const getTrade = async (req, res) => {
  const trade = await Trade.findById(req.params.id);
  if (!trade) {
    return res.status(404).json({ message: "Trade not found." });
  }
  return res.json({ trade });
};

// Create a trade for the logged-in user.
export const createTrade = async (req, res) => {
  const payload = { ...req.body, user: req.user.id };
  const trade = await Trade.create(payload);
  res.status(201).json({ trade });
};

// Update a trade by ID.
export const updateTrade = async (req, res) => {
  const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!trade) {
    return res.status(404).json({ message: "Trade not found." });
  }
  return res.json({ trade });
};

// Delete a trade by ID.
export const deleteTrade = async (req, res) => {
  const trade = await Trade.findByIdAndDelete(req.params.id);
  if (!trade) {
    return res.status(404).json({ message: "Trade not found." });
  }
  return res.json({ ok: true });
}; 

