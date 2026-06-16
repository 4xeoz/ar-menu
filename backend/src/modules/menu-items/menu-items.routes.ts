import { Router } from "express";
import { menuItemsController } from "./menu-items.controller";
import { requireAuth } from "../../middleware/auth";

// All routes nested under /restaurants/:restaurantId/menu-items
// restaurantId comes from the parent router (see app.ts)
const router = Router({ mergeParams: true });

// Public — customers load menu items when they scan QR
router.get("/", menuItemsController.getAll);
router.get("/:id", menuItemsController.getById);

// Protected — only admin can manage items
router.use(requireAuth);
router.post("/", menuItemsController.create);
router.patch("/:id", menuItemsController.update);
router.delete("/:id", menuItemsController.delete);

export default router;
