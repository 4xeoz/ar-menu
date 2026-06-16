import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import authRoutes from "./modules/auth/auth.routes";
import restaurantsRoutes from "./modules/restaurants/restaurants.routes";
import menuItemsRoutes from "./modules/menu-items/menu-items.routes";

const app = express();

// Only allow requests from your frontend domain
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

// Health check — used by uptime monitors
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// All API routes versioned under /api/v1
// Versioning matters here: QR codes get printed on tables and can't be changed easily
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantsRoutes);
app.use("/api/v1/restaurants/:restaurantId/menu-items", menuItemsRoutes);

// Central error handler — must be last
app.use(errorHandler);

export default app;
