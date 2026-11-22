import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        data: result,
        error: null,
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      res.status(200).json({
        data: result,
        error: null,
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  },
};