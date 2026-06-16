import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authService } from "./auth.service";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = credentialsSchema.parse(req.body);
      const result = await authService.register(email, password);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = credentialsSchema.parse(req.body);
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
      const result = await authService.refresh(refreshToken);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = z.object({ refreshToken: z.string() }).parse(req.body);
      await authService.logout(refreshToken);
      res.json({ success: true, data: { message: "Logged out" } });
    } catch (err) {
      next(err);
    }
  },
};
