import { db } from "../../config/db";

export const menuItemsRepository = {
  // Always scoped to a restaurant_id — this is the tenant boundary
  async findAllByRestaurant(restaurantId: string) {
    const result = await db.query(
      "SELECT * FROM menu_items WHERE restaurant_id = $1 AND is_available = true ORDER BY sort_order ASC, created_at ASC",
      [restaurantId]
    );
    return result.rows;
  },

  async findById(id: string, restaurantId: string) {
    const result = await db.query(
      "SELECT * FROM menu_items WHERE id = $1 AND restaurant_id = $2",
      [id, restaurantId]
    );
    return result.rows[0] ?? null;
  },

  async create(data: {
    restaurant_id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    model_url?: string;
    sort_order?: number;
  }) {
    const result = await db.query(
      `INSERT INTO menu_items (restaurant_id, name, description, price, image_url, model_url, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [data.restaurant_id, data.name, data.description, data.price, data.image_url, data.model_url, data.sort_order ?? 0]
    );
    return result.rows[0];
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
    const result = await db.query(
      `UPDATE menu_items SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        image_url = COALESCE($4, image_url),
        model_url = COALESCE($5, model_url),
        sort_order = COALESCE($6, sort_order),
        is_available = COALESCE($7, is_available)
       WHERE id = $8 AND restaurant_id = $9 RETURNING *`,
      [data.name, data.description, data.price, data.image_url, data.model_url, data.sort_order, data.is_available, id, restaurantId]
    );
    return result.rows[0] ?? null;
  },

  async delete(id: string, restaurantId: string) {
    await db.query(
      "DELETE FROM menu_items WHERE id = $1 AND restaurant_id = $2",
      [id, restaurantId]
    );
  },
};
