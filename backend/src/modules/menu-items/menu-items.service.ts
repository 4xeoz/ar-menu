import { menuItemsRepository } from "./menu-items.repository";

export const menuItemsService = {
  async getAll(restaurantId: string) {
    return menuItemsRepository.findAllByRestaurant(restaurantId);
  },

  async getById(id: string, restaurantId: string) {
    const item = await menuItemsRepository.findById(id, restaurantId);
    if (!item) throw new Error("Menu item not found");
    return item;
  },

  async create(restaurantId: string, data: {
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    model_url?: string;
    sort_order?: number;
  }) {
    return menuItemsRepository.create({ restaurant_id: restaurantId, ...data });
  },

  async update(id: string, restaurantId: string, data: {
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    model_url?: string;
    sort_order?: number;
    is_available?: boolean;
  }) {
    const item = await menuItemsRepository.update(id, restaurantId, data);
    if (!item) throw new Error("Menu item not found");
    return item;
  },

  async delete(id: string, restaurantId: string) {
    await menuItemsService.getById(id, restaurantId); // throws if not found
    await menuItemsRepository.delete(id, restaurantId);
  },
};
