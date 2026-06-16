import { Router } from "express";
import { restaurantsController } from "./restaurants.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

// Public — customers need to load a restaurant by slug
router.get("/slug/:slug", restaurantsController.getBySlug);

// Protected — only you (admin) can manage restaurants
router.use(requireAuth);
router.get("/", restaurantsController.getAll);
router.get("/:id", restaurantsController.getById);
router.post("/", restaurantsController.create);
router.patch("/:id", restaurantsController.update);
router.delete("/:id", restaurantsController.delete);

export default router;
