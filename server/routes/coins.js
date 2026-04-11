import express from "express";
import {
  createCoin,
  listCoins,
  updateCoin,
} from "../controllers/coinsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public: list active coins.
router.get("/", listCoins);

// Admin: manage coin catalog.
router.post("/", requireAuth, requireRole("admin"), createCoin);
router.put("/:id", requireAuth, requireRole("admin"), updateCoin);

export default router;
