import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/email.js";
import { clearAuthAnomaly, logAuthAnomaly } from "../middleware/security.js";

const PASSWORD_POLICY =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // at least 8 chars, mixed case, number, symbol
const HASH_ROUNDS = 12;
// Reset links expire after 1 hour for safety.
const RESET_TOKEN_TTL_MS = 1000 * 60 * 60;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const toSafeUser = (user) => (user ? user.toJSON() : null);
const normalizeEmail = (value) => value?.toLowerCase().trim();
const normalizeText = (value) => value?.trim() ?? "";
// The reset link points to the frontend reset page with the token attached.
const buildResetUrl = (token) =>
  `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

// Store only a hash of the token in the DB; the raw token goes to the user.
const createResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  return { token, tokenHash, expires };
};

// Sends a reset link via email (HTML + plain text).
const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = buildResetUrl(token);
  const subject = "Reset your TrusonXchanger password";
  const text = [
    "You requested a password reset for your TrusonXchanger account.",
    "",
    "Reset your password using this link:",
    resetUrl,
    "",
    "If you did not request this, you can ignore this message.",
  ].join("\n");
  const html = `
    <p>You requested a password reset for your TrusonXchanger account.</p>
    <p>Use the button or copy/paste the full link below:</p>
    <p style="margin:16px 0;">
      <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#198754;color:#fff;text-decoration:none;border-radius:6px;">
        Reset password
      </a>
    </p>
    <p style="word-break:break-all;"><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request this, you can ignore this message.</p>
  `;

  await sendEmail({ to: user.email, subject, text, html });
};

// Signup: validate input, hash password, create user, return safe profile.
export const register = async (req, res) => {
  const { name, email, password, referralId } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!PASSWORD_POLICY.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include upper/lower case letters, a number, and a symbol.",
    });
  }

  const normalizedEmail = normalizeEmail(email);
  const cleanedName = normalizeText(name);
  const cleanedReferral = normalizeText(referralId);

  const existing = await User.exists({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: "Email already in use." });
  }

  const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);

  const user = await User.create({
    name: cleanedName,
    email: normalizedEmail,
    passwordHash,
    referralId: cleanedReferral,
  });

  return res.status(201).json({
    user: toSafeUser(user),
    message: "Registration successful.",
  });
};

// Login: look up active user, compare hash, and issue JWT.
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({
    email: normalizedEmail,
    status: "active",
  }).select("+passwordHash");

  // Avoid leaking whether the email existed by running the same response path.
  if (!user) {
    logAuthAnomaly(req, "user-not-found");
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    logAuthAnomaly(req, "invalid-password");
    return res.status(401).json({ message: "Invalid credentials." });
  }

  clearAuthAnomaly(req);
  const token = signToken({ sub: user.id, role: user.role });
  return res.json({ user: toSafeUser(user), token });
};

export const me = async (req, res) => {
  return res.json({ user: toSafeUser(req.user) });
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const normalizedEmail = normalizeEmail(email);
  // We respond the same either way so we don’t leak whether the email exists.
  const user = await User.findOne({
    email: normalizedEmail,
    status: "active",
  });

  if (!user) {
    logAuthAnomaly(req, "forgot-user-not-found");
    return res.json({
      message:
        "If that email matches an account, reset instructions have been sent.",
    });
  }

  // Save a hashed token + expiry on the user record.
  const { token, tokenHash, expires } = createResetToken();
  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpires = expires;
  await user.save();

  await sendPasswordResetEmail(user, token);

  return res.json({
    message:
      "If that email matches an account, reset instructions have been sent.",
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token and password are required." });
  }

  if (!PASSWORD_POLICY.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include upper/lower case letters, a number, and a symbol.",
    });
  }

  // Hash the incoming token and match it against what we stored.
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
    status: "active",
  }).select("+resetPasswordTokenHash");

  if (!user) {
    logAuthAnomaly(req, "reset-token-invalid");
    return res
      .status(400)
      .json({ message: "Invalid or expired password reset token." });
  }

  // Update password and clear reset fields so the token can’t be reused.
  user.passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
  user.resetPasswordTokenHash = "";
  user.resetPasswordExpires = null;
  await user.save();

  clearAuthAnomaly(req);
  return res.json({ message: "Password reset successfully." });
};
