import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { aiController } from "../controllers/aiController";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    error: {
      message: "AI rate limit exceeded. Please try again later.",
    },
    meta: null,
  },
});

router.post(
  "/tickets/:ticketId/suggest-reply",
  requireAuth,
  requireRole("AGENT", "ADMIN"),
  aiLimiter,
  aiController.suggestReply,
);

router.post(
  "/tickets/:ticketId/classify",
  requireAuth,
  requireRole("AGENT", "ADMIN"),
  aiLimiter,
  aiController.classifyTicket,
);

export default router;
