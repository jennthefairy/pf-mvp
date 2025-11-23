async function post(url, data) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: data ? JSON.stringify(data) : "{}" });
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
document.getElementById("btn-login")?.addEventListener("click", async () => {
  const email = prompt("Email:"); if (!email) return;
  await post("/api/auth/signup", { email });
  await post("/api/auth/login", { email });
  alert("Logged in (demo).");
});
document.getElementById("btn-credits")?.addEventListener("click", async () => {
  const res = await post("/api/checkout"); const url = typeof res === "string" ? null : res.url; if (url) location.href = url;
});
document.getElementById("btn-email")?.addEventListener("click", async () => {
  const data = await post("/api/email", { to: "you@example.com", subject: "Test", html: "<b>Hello from Workers</b>" });
  alert("Email sent: " + (data?.id || "ok"));
});
