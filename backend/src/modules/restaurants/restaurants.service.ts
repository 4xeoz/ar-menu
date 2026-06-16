import { restaurantsRepository } from "./restaurants.repository";

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const restaurantsService = {
  async getAll() {
    return restaurantsRepository.findAll();
  },

  async getBySlug(slug: string) {
    const restaurant = await restaurantsRepository.findBySlug(slug);
    if (!restaurant) throw new Error("Restaurant not found");
    return restaurant;
  },

  async getById(id: string) {
    const restaurant = await restaurantsRepository.findById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    return restaurant;
  },

  async create(data: { name: string; logo_url?: string }) {
    const slug = slugify(data.name);
    const existing = await restaurantsRepository.findBySlug(slug);
    if (existing) throw new Error(`Slug "${slug}" already taken — use a different restaurant name`);
    return restaurantsRepository.create({ ...data, slug });
  },

  async update(id: string, data: { name?: string; logo_url?: string; is_active?: boolean }) {
    const restaurant = await restaurantsRepository.update(id, data);
    if (!restaurant) throw new Error("Restaurant not found");
    return restaurant;
  },

  async delete(id: string) {
    await restaurantsRepository.findById(id); // throws if not found
    await restaurantsRepository.delete(id);
  },
};
