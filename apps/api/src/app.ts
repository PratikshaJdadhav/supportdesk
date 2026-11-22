
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import helmet from "helmet";
import cors from "cors";
import ticketRoutes from "./routes/ticketRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

// Request Logger
app.use(requestLogger);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health Check API
app.get("/health", (req, res) => {
  res.status(200).json({
    data: { status: "OK" },
    error: null,
    meta: null,
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
