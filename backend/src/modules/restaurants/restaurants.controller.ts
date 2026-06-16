import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { restaurantsService } from "./restaurants.service";

const createSchema = z.object({
  name: z.string().min(1),
  logo_url: z.string().url().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  logo_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
});

export const restaurantsController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await restaurantsService.getAll();
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await restaurantsService.getBySlug(req.params.slug);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await restaurantsService.getById(req.params.id);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createSchema.parse(req.body);
      const data = await restaurantsService.create(input);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateSchema.parse(req.body);
      const data = await restaurantsService.update(req.params.id, input);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await restaurantsService.delete(req.params.id);
      res.json({ success: true, data: { message: "Deleted" } });
    } catch (err) { next(err); }
  },
};
