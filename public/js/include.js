async function includeFragments() {
  const slots = document.querySelectorAll("[data-include]");
  await Promise.all([...slots].map(async el => {
    const url = el.getAttribute("data-include");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      const html = await res.text();
      el.outerHTML = html;
    } catch (e) {
      console.warn("Include failed:", url, e);
    }
  }));
  // Re-render icon set if Lucide is present (for dynamically injected icons)
  try {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
    }
  } catch {}
}
includeFragments();
