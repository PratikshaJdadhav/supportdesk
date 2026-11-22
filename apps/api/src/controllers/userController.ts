import { Request, Response, NextFunction } from "express";
import { userRepository } from "../repositories/userRepository";

export const userController = {
  async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userRepository.findByRole("CUSTOMER");

      res.status(200).json({
        data: users,
        error: null,
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAgents(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userRepository.findByRole("AGENT");

      res.status(200).json({
        data: users,
        error: null,
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
