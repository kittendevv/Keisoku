import { Hono } from "hono";
import { allRoute } from "./routes/all";
import { statRoute } from "./routes/stat";
import { providersRoute } from "./routes/providers";
import { loadProviders } from "./utils/providers";
import { getAllStats, getStatValue } from "./utils/statFetcher";
import { listProviders } from "./utils/providers";

const app = new Hono();

// Load providers on startup
loadProviders();

// Root routes (using keisoku.yaml)
app.get("/api/all", async (c) => {
  const results = await getAllStats();
  return c.json(results);
});

app.get("/api/:stat", async (c) => {
  const statId = c.req.param("stat");
  try {
    const result = await getStatValue(statId);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

app.get("/api/providers", async (c) => {
  const data = listProviders();
  return c.json({
    count: data.length,
    providers: data,
  });
});

// Named routes (using keisoku-{name}.yaml)
app.get("/api/:name/all", async (c) => {
  const name = c.req.param("name");
  const results = await getAllStats(name);
  return c.json(results);
});

app.get("/api/:name/:stat", async (c) => {
  const name = c.req.param("name");
  const statId = c.req.param("stat");
  try {
    const result = await getStatValue(statId, name);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

app.get("/api/:name/providers", async (c) => {
  const data = listProviders();
  return c.json({
    count: data.length,
    providers: data,
  });
});

export default app;
