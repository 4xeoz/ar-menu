import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { menuItemsService } from "./menu-items.service";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  image_url: z.string().url().optional(),
  model_url: z.string().optional(),
  sort_order: z.number().int().optional(),
});

const updateSchema = createSchema.partial().extend({
  is_available: z.boolean().optional(),
});

export const menuItemsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await menuItemsService.getAll(req.params.restaurantId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await menuItemsService.getById(req.params.id, req.params.restaurantId);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createSchema.parse(req.body);
      const data = await menuItemsService.create(req.params.restaurantId, input);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateSchema.parse(req.body);
      const data = await menuItemsService.update(req.params.id, req.params.restaurantId, input);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await menuItemsService.delete(req.params.id, req.params.restaurantId);
      res.json({ success: true, data: { message: "Deleted" } });
    } catch (err) { next(err); }
  },
};
