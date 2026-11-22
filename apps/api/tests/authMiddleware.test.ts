import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { requireAuth, requireRole } from "../src/middleware/authMiddleware";
import { env } from "../config/env";

describe("Auth Middleware Unit Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    next = jest.fn();
  });

  describe("requireAuth", () => {
    test("should return 401 when token is missing", () => {
      requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next when token is valid", () => {
      const token = jwt.sign(
        { userId: 1, role: "CUSTOMER" },
        env.JWT_SECRET
      );

      req.headers = { authorization: `Bearer ${token}` };

      requireAuth(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.locals?.authUser).toMatchObject({
        userId: 1,
        role: "CUSTOMER",
      });
    });

    test("should return 401 when token is invalid", () => {
      req.headers = { authorization: "Bearer invalid-token" };

      requireAuth(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireRole", () => {
    test("should allow AGENT role", () => {
      res.locals = { authUser: { userId: 1, role: "AGENT" } };

      requireRole("AGENT")(
        req as Request,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalled();
    });

    test("should return 403 for unauthorized role", () => {
      res.locals = { authUser: { userId: 1, role: "CUSTOMER" } };

      requireRole("AGENT")(
        req as Request,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
