import { Router } from "express";
import { userController } from "../controllers/userController";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/customers",
  requireAuth,
  requireRole("ADMIN"),
  userController.getCustomers
);

router.get(
  "/agents",
  requireAuth,
  requireRole("ADMIN"),
  userController.getAgents
);

export default router;
