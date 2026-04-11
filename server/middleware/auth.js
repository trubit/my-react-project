import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

// NOTE: Verifies the JWT in the Authorization header and loads the user onto req.user.
export const requireAuth = async (req, res, next) => {
  try {
    // NOTE: Expect "Authorization: Bearer <token>".
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // NOTE: Verify token signature and read payload.
    const decoded = verifyToken(token);
    // NOTE: Fetch the user by id stored in the token.
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // NOTE: Attach user to request for downstream handlers.
    req.user = user;
    return next();
  } catch {
    // NOTE: Any error means the token is invalid or expired.
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// NOTE: Allows access only if req.user.role is in the allowed roles list.
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    // NOTE: Block when user is missing or role is not allowed.
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // NOTE: User has the required role, continue.
    return next();
  };
