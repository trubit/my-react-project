import jwt from "jsonwebtoken";

// Helpers to sign/verify JWTs using env-configured secrets.
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// NOTE: signToken takes a payload (e.g. { sub: userId }) and returns a signed JWT string.
export const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
// NOTE: verifyToken takes a token string and returns the decoded payload if valid, or throws an error if invalid/expired.
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
