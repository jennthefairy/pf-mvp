import { json, bad } from "../util/responses";
import { requireUser } from "../util/auth"; // 1. Import helpers

export const onRequestPost: PagesFunction = async (ctx) => {
  // 2. Add the conditional auth check
  if ((ctx.env as any).ENV === "production") {
    const user = await requireUser(ctx);
    if (!user) {
      return bad("You must be logged in.", 401);
    }
  }
  
  // 3. Your existing logic runs as normal
  const params = new URLSearchParams({
    mode: "payment",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": "Credit Pack (100)",
    "line_items[0][price_data][unit_amount]": "500",
    "line_items[0][quantity]": "1",
    success_url: "https://your-site.pages.dev/?success=1",
    cancel_url: "https://your-site.pages.dev/?canceled=1",
    "metadata[credits]": "100"
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${(ctx.env as any).STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  const jsonRes = await res.json() as any;
  return json({ url: jsonRes.url }, { status: res.ok ? 200 : 400 });
};
