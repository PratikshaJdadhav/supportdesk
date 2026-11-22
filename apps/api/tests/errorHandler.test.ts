import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../src/middleware/errorHandler";

describe("errorHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 401 for invalid email or password", () => {
    const err = new Error("Invalid email or password");

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: { message: "Invalid email or password" },
      meta: null,
    });
  });

  it("should return 409 for duplicate email", () => {
    const err = new Error("Email already registered");

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: { message: "Email already registered" },
      meta: null,
    });
  });

  it("should return 500 for unknown errors", () => {
    const err = new Error("Something went wrong");

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: null,
      error: { message: "Internal Server Error" },
      meta: null,
    });
  });
});