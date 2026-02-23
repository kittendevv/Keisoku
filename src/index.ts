import { Hono } from "hono";
import { loadProviders } from "./utils/providers";
import { getAllStats, getStatValue } from "./utils/statFetcher";
import { listProviders } from "./utils/providers";

const app = new Hono();

// Load providers on startup
loadProviders();

function getConfigName(c: any): string | undefined {
  const file = c.req.query("file");
  return file ? file.trim() || undefined : undefined;
}

app.get("/api/providers", async (c) => {
  const data = listProviders();
  return c.json({
    count: data.length,
    providers: data,
  });
});

app.get("/api/all", async (c) => {
  const name = getConfigName(c);
  const results = await getAllStats(name);
  return c.json(results);
});

app.get("/api/:stat", async (c) => {
  const name = getConfigName(c);
  const statId = c.req.param("stat");
  try {
    const result = await getStatValue(statId, name);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

export default app;
