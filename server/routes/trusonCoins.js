import express from "express";
import {
  getTrusonWallet,
  spendTrusonCoins,
} from "../controllers/trusonCoinsController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Logged-in user: view wallet + recent transactions.
router.get("/wallet", requireAuth, getTrusonWallet);

// Logged-in user: spend their own TrusonCoins.
router.post("/spend", requireAuth, spendTrusonCoins);

export default router;
