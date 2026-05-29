import crypto from "crypto";
import ai from "../configs/ai.js";

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

const getCacheKey = (feature, content) =>
  crypto
    .createHash("sha256")
    .update(`${feature}:${content}`)
    .digest("hex");

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCache = (key, value) => {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  if (cache.size > 500) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const chatCompletion = async ({
  systemPrompt,
  userContent,
  json = false,
  feature = "generic",
  useCache = true,
  maxRetries = 2,
}) => {
  if (!userContent?.trim()) {
    throw Object.assign(new Error("Content is required"), { statusCode: 400 });
  }

  const cacheKey = getCacheKey(feature, `${systemPrompt}|${userContent}`);
  if (useCache) {
    const cached = getCached(cacheKey);
    if (cached) return cached;
  }

  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        temperature: 0.4,
        max_tokens: json ? 2000 : 800,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        ...(json ? { response_format: { type: "json_object" } } : {}),
      });

      const text = response.choices[0]?.message?.content?.trim() || "";
      if (useCache) setCache(cacheKey, text);
      return text;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) await sleep(400 * (attempt + 1));
    }
  }

  throw lastError;
};

export const streamChatCompletion = async (res, { systemPrompt, userContent }) => {
  const stream = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    temperature: 0.4,
    max_tokens: 800,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
  }
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
};
