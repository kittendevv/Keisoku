import { Hono } from "hono";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { loadProviders } from "./utils/providers";
import { getAllStats, getStatValue } from "./utils/statFetcher";
import { listProviders } from "./utils/providers";
import { openApiSpec } from "./openapi";

const app = new Hono();

app.use("/api/*", cors({ origin: "*" }));

// Load providers on startup
loadProviders();

app.get("/api/openapi.json", (c) => c.json(openApiSpec));
app.get("/api/docs", swaggerUI({ url: "/api/openapi.json" }));

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
