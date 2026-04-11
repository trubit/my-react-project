import express from "express";
import {
  createSubscription,
  deleteSubscription,
  listSubscriptions,
  updateSubscription,
} from "../controllers/subscriptionsController.js";
import { requireAuth } from "../middleware/auth.js";

// Subscription routes (authenticated).
const router = express.Router();
// All routes require authentication.
router.get("/", requireAuth, listSubscriptions);
router.post("/", requireAuth, createSubscription);
router.put("/:id", requireAuth, updateSubscription);
router.delete("/:id", requireAuth, deleteSubscription);

export default router;
