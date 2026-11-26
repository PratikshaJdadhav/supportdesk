

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.message === "Invalid email or password") {
    statusCode = 401;
    message = err.message;
  } else if (err.message === "Email already registered") {
    statusCode = 409;
    message = err.message;
  }

  res.status(statusCode).json({
    data: null,
    error: { message },
    meta: null,
  });
};
