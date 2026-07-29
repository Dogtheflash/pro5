import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoints
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/make-server-762d7aa5/health", (c) => {
  return c.json({ status: "ok" });
});

// i18n locale codes → DeepL target language codes.
// Khmer (km), Lao (lo), and Burmese (my) are absent — DeepL has no model for them,
// so untranslated English is returned on the client instead of a bad translation.
const DEEPL_TARGET: Record<string, string> = {
  vi: "VI",
  th: "TH",
  id: "ID",
  ms: "MS",
  fil: "TL",
  ja: "JA",
  zh: "ZH",
  ko: "KO",
  ar: "AR",
};

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function handleTranslate(c: any) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const target = String(body?.target ?? "").toLowerCase();
    const texts: string[] = Array.isArray(body?.q)
      ? body.q.map((t: unknown) => String(t ?? ""))
      : [];

    const deeplCode = DEEPL_TARGET[target];
    if (!deeplCode || target === "en" || texts.length === 0) {
      return c.json({ translations: texts });
    }

    // Look up KV cache for every string at once
    const hashes = await Promise.all(texts.map((t) => sha256(t)));
    const cacheKeys = hashes.map((h) => `dl:${target}:${h}`);
    let cached: any[] = [];
    try {
      cached = await kv.mget(cacheKeys);
    } catch {
      cached = new Array(texts.length).fill(null);
    }

    const out: string[] = new Array(texts.length);
    const missIdx: number[] = [];
    texts.forEach((t, i) => {
      const hit = cached[i];
      if (typeof hit === "string") out[i] = hit;
      else missIdx.push(i);
    });

    // Translate cache misses via DeepL (one batched request)
    if (missIdx.length > 0) {
      const key = Deno.env.get("DEEPL_API_KEY");
      if (!key) {
        console.log("translate: DEEPL_API_KEY is not set");
        missIdx.forEach((i) => (out[i] = texts[i]));
        return c.json({ translations: out, warning: "missing DEEPL_API_KEY" });
      }
      const host = key.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
      const res = await fetch(`${host}/v2/translate`, {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: missIdx.map((i) => texts[i]),
          source_lang: "EN",
          target_lang: deeplCode,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.log(`translate: DeepL ${res.status} ${detail}`);
        missIdx.forEach((i) => (out[i] = texts[i]));
        return c.json({ translations: out, warning: `deepl ${res.status}` });
      }
      const data = await res.json();
      const translated: string[] = (data?.translations ?? []).map(
        (t: { text: string }) => t.text,
      );

      const storeKeys: string[] = [];
      const storeVals: string[] = [];
      missIdx.forEach((idx, j) => {
        const value = translated[j] ?? texts[idx];
        out[idx] = value;
        storeKeys.push(cacheKeys[idx]);
        storeVals.push(value);
      });
      if (storeKeys.length) {
        try {
          await kv.mset(storeKeys, storeVals);
        } catch (e) {
          console.error("KV mset error:", e);
        }
      }
    }

    return c.json({ translations: out });
  } catch (err) {
    console.log(`translate: unexpected error ${String(err)}`);
    return c.json({ error: "translate failed" }, 500);
  }
}

// Register under both path variants so the function works regardless of
// whether Figma Make deploys it as "server" or "make-server-762d7aa5"
app.post("/translate", handleTranslate);
app.post("/make-server-762d7aa5/translate", handleTranslate);

Deno.serve(app.fetch);
