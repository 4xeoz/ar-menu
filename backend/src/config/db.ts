import { Pool } from "pg";
import { env } from "./env";

// One shared connection pool for the whole app.
// pg handles opening/closing connections automatically.
export const db = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,          // max 10 simultaneous DB connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function connectDB() {
  const client = await db.connect();
  client.release();
  console.log("✅ Database connected");
}
