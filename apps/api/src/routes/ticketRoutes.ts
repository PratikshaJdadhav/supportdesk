
import { commentController } from "../controllers/commentController";
import { Router } from "express";
import { ticketController } from "../controllers/ticketController";
import { requireAuth, requireRole } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Login issue
 *               description:
 *                 type: string
 *                 example: Unable to login to my account
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: HIGH
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth, requireRole("CUSTOMER"), ticketController.create);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get tickets with pagination, filters and sorting
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, CLOSED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *       - in: query
 *         name: assigneeId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, priority, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
router.get("/", requireAuth, ticketController.getAll);

/**
 * @swagger
 * /api/tickets/{ticketId}/comments:
 *   post:
 *     summary: Add a comment to a ticket
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: I am facing this issue.
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid ticket ID or message
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *   get:
 *     summary: Get comments for a ticket
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       400:
 *         description: Invalid ticket ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */
router.post("/:ticketId/comments", requireAuth, requireRole("ADMIN"), commentController.create);
router.get("/:ticketId/comments", requireAuth, commentController.getAll);

/**
 * @swagger
 * /api/tickets/agent-only:
 *   get:
 *     summary: Check agent-only access
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent access granted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Agent role required
 */
router.get(
  "/agent-only",
  requireAuth,
requireRole("AGENT", "ADMIN"),
  (req, res) => {
    res.status(200).json({
      data: { message: "Agent access granted" },
      error: null,
      meta: null,
    });
  }
);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, CLOSED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */
router.get("/:id", requireAuth, ticketController.getById);
router.put("/:id", requireAuth, ticketController.update);
router.delete("/:id", requireAuth, ticketController.delete);

export default router;
