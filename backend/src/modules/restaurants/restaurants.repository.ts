import { db } from "../../config/db";

export const restaurantsRepository = {
  async findAll() {
    const result = await db.query(
      "SELECT id, name, slug, logo_url, is_active, created_at FROM restaurants ORDER BY created_at DESC"
    );
    return result.rows;
  },

  async findBySlug(slug: string) {
    const result = await db.query(
      "SELECT id, name, slug, logo_url, is_active FROM restaurants WHERE slug = $1",
      [slug]
    );
    return result.rows[0] ?? null;
  },

  async findById(id: string) {
    const result = await db.query(
      "SELECT id, name, slug, logo_url, is_active, created_at FROM restaurants WHERE id = $1",
      [id]
    );
    return result.rows[0] ?? null;
  },

  async create(data: { name: string; slug: string; logo_url?: string }) {
    const result = await db.query(
      "INSERT INTO restaurants (name, slug, logo_url) VALUES ($1, $2, $3) RETURNING *",
      [data.name, data.slug, data.logo_url ?? null]
    );
    return result.rows[0];
  },

  async update(id: string, data: { name?: string; logo_url?: string; is_active?: boolean }) {
    const result = await db.query(
      `UPDATE restaurants SET
        name = COALESCE($1, name),
        logo_url = COALESCE($2, logo_url),
        is_active = COALESCE($3, is_active)
       WHERE id = $4 RETURNING *`,
      [data.name, data.logo_url, data.is_active, id]
    );
    return result.rows[0] ?? null;
  },

  async delete(id: string) {
    await db.query("DELETE FROM restaurants WHERE id = $1", [id]);
  },
};
