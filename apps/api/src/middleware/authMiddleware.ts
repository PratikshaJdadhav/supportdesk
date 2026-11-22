import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

interface AuthPayload {
  userId: number;
  role: UserRole;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      data: null,
      error: { message: "Authentication token required" },
      meta: null,
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "number" ||
      !["CUSTOMER", "AGENT", "ADMIN"].includes(decoded.role)
    ) {
      res.status(401).json({
        data: null,
        error: { message: "Invalid authentication token" },
        meta: null,
      });
      return;
    }

    res.locals.authUser = decoded as AuthPayload;
    next();
  } catch {
    res.status(401).json({
      data: null,
      error: { message: "Invalid or expired token" },
      meta: null,
    });
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.authUser as AuthPayload | undefined;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({
        data: null,
        error: { message: "Access forbidden" },
        meta: null,
      });
      return;
    }

    next();
  };
};