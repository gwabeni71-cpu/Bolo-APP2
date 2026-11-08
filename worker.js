// BOLO Insider proxy: keeps the Groq key secret. Deploy on Cloudflare Workers (free).
export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
    const ok = allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": ok ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || !ok) return new Response("Forbidden", { status: 403, headers: cors });
    let body;
    try { body = await req.json(); } catch (e) { return new Response("Bad request", { status: 400, headers: cors }); }
    const last = (body.messages || []).filter(m => m.role === "user").pop();
    const text = String((last && last.content) || "").slice(0, 500);
    if (!text) return new Response("Bad request", { status: 400, headers: cors });
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + env.GROQ_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are BOLO INSIDER, a cinema expert. Keep responses concise (max 150 words)." },
          { role: "user", content: text }
        ],
        max_tokens: 400,
        temperature: 0.7
      })
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
  }
};
