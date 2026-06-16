import { Router } from "express";
import { authController } from "./auth.controller";
import rateLimit from "express-rate-limit";

// Strict rate limit on auth routes — stops brute-force password attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, error: { code: "RATE_LIMITED", message: "Too many attempts, try again later" } },
});

const router = Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
