import { getDb } from "../db/client";
import { credits, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const raw = await request.text();        // raw body
  const payload = JSON.parse(raw || "{}");
  if (payload.type !== "checkout.session.completed") return new Response("ok");

  const email = payload.data?.object?.customer_details?.email;
  const add = parseInt(payload.data?.object?.metadata?.credits || "0", 10) || 0;
  if (!email || !add) return new Response("ok");

  const db = getDb(env as any);
  const u = (await db.select().from(users).where(eq(users.email, email)))[0];
  if (!u) return new Response("ok");

  const rows = await db.select().from(credits).where(eq(credits.userId, u.id));
  if (rows.length === 0) {
    await db.insert(credits).values({ userId: u.id, balance: add });
  } else {
    await db.update(credits).set({ balance: rows[0].balance + add }).where(eq(credits.id, rows[0].id));
  }
  return new Response("ok");
};
