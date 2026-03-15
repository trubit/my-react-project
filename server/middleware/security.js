import rateLimit from "express-rate-limit";

// Rate limiting + lightweight anomaly tracking for auth endpoints.
const WINDOW_MS = 10 * 60 * 1000;
const THRESHOLD = 4;
const anomalyTracker = new Map();

const normalizeEmail = (value) =>
  typeof value === "string" ? value.toLowerCase().trim() : "unknown";
const trackerKey = (req) =>
  `${req.ip}:${normalizeEmail(req.body?.email ?? req.query?.email)}`;

const cleanupOldEntries = (now) => {
  for (const [key, entry] of anomalyTracker.entries()) {
    if (now - entry.firstSeen > WINDOW_MS * 3) {
      anomalyTracker.delete(key);
    }
  }
};

export const logAuthAnomaly = (req, reason) => {
  const key = trackerKey(req);
  const now = Date.now();
  cleanupOldEntries(now);

  const entry = anomalyTracker.get(key) ?? {
    count: 0,
    firstSeen: now,
    email: normalizeEmail(req.body?.email),
  };
  if (now - entry.firstSeen > WINDOW_MS) {
    entry.count = 0;
    entry.firstSeen = now;
  }
  entry.count += 1;
  entry.lastSeen = now;
  anomalyTracker.set(key, entry);

  if (entry.count >= THRESHOLD) {
    console.warn(
      `[AUTH ANOMALY] ${reason}; ip=${req.ip} email=${entry.email} attempts=${entry.count} route=${req.path}`,
    );
  } else {
    console.info(
      `[AUTH NOTICE] ${reason}; ip=${req.ip} email=${entry.email} attempts=${entry.count}`,
    );
  }
};

export const clearAuthAnomaly = (req) => {
  anomalyTracker.delete(trackerKey(req));
};

const createLimiter = (options) =>
  rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: { message: options.message },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const loginLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts; try again shortly.",
});

export const registerLimiter = createLimiter({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: "Too many signup attempts; please wait and try again.",
});

// Limit how often reset links can be requested.
export const forgotPasswordLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 4,
  message: "Too many password reset requests; wait a bit and try again.",
});

// Limit how often reset tokens can be tried.
export const resetPasswordLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 6,
  message: "Too many password reset attempts; wait before retrying.",
});
