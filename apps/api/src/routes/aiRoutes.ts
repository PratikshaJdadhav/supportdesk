import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/tickets/:ticketId/suggest-reply",
  requireAuth,
  requireRole("AGENT", "ADMIN"),
  aiController.suggestReply,
);

router.post(
  "/tickets/:ticketId/classify",
  requireAuth,
  requireRole("AGENT", "ADMIN"),
  aiController.classifyTicket,
);

export default router;
