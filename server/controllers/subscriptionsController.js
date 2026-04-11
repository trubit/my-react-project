import Subscription from "../models/Subscription.js";

// List subscriptions (admins see all, users see theirs).
export const listSubscriptions = async (req, res) => {
  const filter = req.user?.role === "admin" ? {} : { user: req.user.id };
  const subscriptions = await Subscription.find(filter).sort({ createdAt: -1 });
  res.json({ subscriptions });
};

// Create a subscription for the logged-in user.
export const createSubscription = async (req, res) => {
  const payload = { ...req.body, user: req.user.id };
  const subscription = await Subscription.create(payload);
  res.status(201).json({ subscription });
};

// Update subscription details by ID.
export const updateSubscription = async (req, res) => {
  const subscription = await Subscription.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found." });
  }

  return res.json({ subscription });
};

// Delete a subscription by ID.
export const deleteSubscription = async (req, res) => {
  const subscription = await Subscription.findByIdAndDelete(req.params.id);
  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found." });
  }
  return res.json({ ok: true });
};
