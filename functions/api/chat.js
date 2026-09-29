const SYSTEM_PROMPT = [
  "Anda adalah JagaOmzet Assistant, asisten penjualan untuk produk SaaS JagaOmzet.",
  "Jawab dalam Bahasa Indonesia, singkat, jelas, ramah, dan jangan mengarang fitur.",
  "JagaOmzet membantu bisnis mengumpulkan feedback pelanggan melalui QR, melihat feedback dan data pelanggan dalam dashboard, memantau outlet, memakai template Google Review, dan menggunakan kupon untuk membantu pelanggan kembali.",
  "JagaOmzet BUKAN aplikasi kasir/POS.",
  "Trial resmi: 14 hari gratis, tanpa kartu kredit.",
  "Paket Partner: biaya aktivasi Rp999.000 sekali bayar. Care Rp99.000/bulan, Bestie Rp199.000/bulan, Sultan Rp299.000/bulan.",
  "Paket Flex: tanpa biaya aktivasi. Care Rp399.000/bulan, Bestie Rp599.000/bulan, Sultan Rp799.000/bulan.",
  "Harga berlaku untuk 1 bisnis / 1 outlet; outlet tambahan tersedia dengan biaya tambahan.",
  "JagaOmzet cocok terutama untuk café, restoran, salon, barbershop, laundry, bengkel, dan klinik kecantikan.",
  "Bila pengunjung tertarik mencoba, arahkan untuk menghubungi WhatsApp JagaOmzet di 0822 9958 2026.",
  "Jangan menyebut diri sebagai manusia dan jangan mengklaim bisa melakukan sesuatu di dashboard yang tidak dijelaskan di prompt ini."
].join("\\n");

function json(data, status = 200, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();

  const chunks = [];
  const output = Array.isArray(data?.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string") chunks.push(part.text);
    }
  }
  return chunks.join("\\n").trim();
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  const allowed = new Set([
    "https://jagaomzet.biz.id",
    "https://www.jagaomzet.biz.id",
    "http://localhost:8788",
    "http://localhost:3000"
  ]);
  if (origin && !allowed.has(origin)) return new Response("Forbidden", { status: 403 });

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "https://jagaomzet.biz.id",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    }
  });
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin") || "";
  const allowed = new Set([
    "https://jagaomzet.biz.id",
    "https://www.jagaomzet.biz.id",
    "http://localhost:8788",
    "http://localhost:3000"
  ]);

  if (origin && !allowed.has(origin)) {
    return json({ error: "Origin tidak diizinkan." }, 403);
  }

  const body = await context.request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];

  if (!message) return json({ error: "Pertanyaan kosong." }, 400, origin);
  if (message.length > 1200) return json({ error: "Pertanyaan terlalu panjang." }, 413, origin);

  const apiKey = context.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: "AI belum dikonfigurasi." }, 503, origin);

  const safeHistory = history
    .filter(item =>
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string"
    )
    .map(item => ({
      role: item.role,
      content: item.content.slice(0, 1200)
    }));

  const input = [
    { role: "developer", content: SYSTEM_PROMPT },
    ...safeHistory,
    { role: "user", content: message }
  ];

  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: context.env.OPENAI_MODEL || "gpt-5.6-luna",
      input,
      max_output_tokens: 300
    })
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return json({ error: "Layanan AI sedang tidak tersedia." }, 502, origin);
  }

  const reply = extractOutputText(data);
  if (!reply) return json({ error: "AI tidak menghasilkan jawaban." }, 502, origin);

  return json({ reply }, 200, origin);
}