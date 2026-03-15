import KycProfile from "../models/KycProfile.js";

// Get the logged-in user's KYC profile.
export const getMyKyc = async (req, res) => {
  const profile = await KycProfile.findOne({ user: req.user.id });
  if (!profile) {
    return res.status(404).json({ message: "KYC profile not found." });
  }
  return res.json({ profile });
};

// Admin view: list all KYC profiles.
export const listKyc = async (_req, res) => {
  const profiles = await KycProfile.find().sort({ createdAt: -1 });
  res.json({ profiles });
};

// Create or update the user's KYC submission.
export const submitKyc = async (req, res) => {
  const payload = {
    user: req.user.id,
    level: req.body.level,
    documents: req.body.documents ?? [],
    status: "pending",
  };
  const profile = await KycProfile.findOneAndUpdate(
    { user: req.user.id },
    payload,
    { new: true, upsert: true, runValidators: true }
  );
  return res.status(201).json({ profile });
};

// Admin review of a KYC profile.
export const reviewKyc = async (req, res) => {
  const profile = await KycProfile.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
      reviewerNote: req.body.reviewerNote,
      reviewedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  if (!profile) {
    return res.status(404).json({ message: "KYC profile not found." });
  }

  return res.json({ profile });
}; 

