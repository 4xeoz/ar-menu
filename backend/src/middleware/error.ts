import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";

// One central place all errors flow to.
// No stack traces leak to the client in production.
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid input", details: err.flatten().fieldErrors },
    });
    return;
  }

  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: env.NODE_ENV === "production" ? "Something went wrong" : err.message,
    },
  });
}
