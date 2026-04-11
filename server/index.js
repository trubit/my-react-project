import "./env.js";
import cors from "cors";
import express from "express";
import connectDb from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import blogsRoutes from "./routes/blogs.js";
import kycRoutes from "./routes/kyc.js";
import subscriptionsRoutes from "./routes/subscriptions.js";
import supportRoutes from "./routes/support.js";
import tradesRoutes from "./routes/trades.js";
import transactionsRoutes from "./routes/transactions.js";
import usersRoutes from "./routes/users.js";
import walletsRoutes from "./routes/wallets.js";
// Log critical configuration at startup for visibility.
console.log(
  `SMTP configured: ${process.env.SMTP_HOST ? "yes" : "no"}; host=${process.env.SMTP_HOST || "unset"}`,
);
console.log(
  `Google client id configured: ${process.env.GOOGLE_CLIENT_ID ? "yes" : "no"}`,
);

// Express app + shared middleware.
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
// CORS configuration: allow all origins if CORS_ORIGIN is "*", otherwise split by comma and allow specific origins.
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? "*" : CORS_ORIGIN.split(","),
  }),
);
// Body parser with size limit to prevent abuse.
app.use(express.json({ limit: "8mb" }));

// Simple health check endpoint.
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});
// API routes.
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/trades", tradesRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/wallets", walletsRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/blogs", blogsRoutes);
// Error handling middleware (should be last).
app.use(notFound);
app.use(errorHandler);
// Start the server after connecting to the database.
const startServer = async () => {
  try {
    await connectDb(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
