import { betterAuth } from "better-auth";
import { getDb } from "../db/client";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export function createAuth(env: any) {
  const db = getDb(env);
  const adapter = {
    async getUserByEmail(email: string) {
      const rows = await db.select().from(users).where(eq(users.email, email));
      return rows[0] || null;
    },
    async createUser(data: { email: string; name?: string | null }) {
      const [row] = await db.insert(users).values({ email: data.email, name: data.name ?? null }).returning();
      return row;
    },
    async createSession(data: { userId: number; token: string; expiresAt: Date }) {
      await db.insert(sessions).values({ userId: data.userId, token: data.token, expiresAt: data.expiresAt });
      return true;
    },
    async getSession(token: string) {
      const rows = await db.select().from(sessions).where(eq(sessions.token, token));
      return rows[0] || null;
    },
    async deleteSession(token: string) {
      await db.delete(sessions).where(eq(sessions.token, token));
      return true;
    }
  };
  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    cookies: { secure: String(env.BETTER_AUTH_SECURE_COOKIES) === "true", sameSite: "lax", httpOnly: true },
    // FIX: Corrected `adapters` (plural) to `adapter` (singular)
    adapter: adapter
  });
}
export async function requireUser(ctx: { env: any; request: Request }) {
  const auth = createAuth(ctx.env);
  // Better-auth session validation - returns user or null
  // This is a placeholder - actual implementation depends on better-auth API
  return null; // TODO: Implement proper session check with better-auth
}
