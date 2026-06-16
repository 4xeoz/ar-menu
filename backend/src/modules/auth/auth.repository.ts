import { db } from "../../config/db";

export const authRepository = {
  async findByEmail(email: string) {
    const result = await db.query(
      "SELECT * FROM admin_users WHERE email = $1",
      [email]
    );
    return result.rows[0] ?? null;
  },

  async createUser(email: string, passwordHash: string) {
    const result = await db.query(
      "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role, created_at",
      [email, passwordHash]
    );
    return result.rows[0];
  },

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    await db.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );
  },

  async findRefreshToken(token: string) {
    const result = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
      [token]
    );
    return result.rows[0] ?? null;
  },

  async deleteRefreshToken(token: string) {
    await db.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
  },
};
