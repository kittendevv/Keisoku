import { Hono } from "hono";
import { loadConfig } from "./utils/config";
import { fetchGithubMetric } from "./providers/github";
import { formatValue } from "./utils/formatter";

const app = new Hono();
const config = loadConfig();

app.get("/", (c) => c.json({ message: "Welcome to Keisoku 🐾" }));

app.get("/api/:stat", async (c) => {
  const statId = c.req.param("stat");
  const stat = config.stats[statId];

  if (!stat) return c.json({ error: "Unknown stat" }, 404);

  try {
    let value: number;

    switch (stat.provider) {
      case "github":
        value = await fetchGithubMetric(statId, stat);
        break;
      default:
        return c.json({ error: `Unsupported provider: ${stat.provider}` }, 400);
    }

    const format = stat.format ?? config.defaults?.format ?? "raw";
    const decimals = stat.decimals ?? config.defaults?.decimals ?? 1;

    const formatted = formatValue(value, { format, decimals });

    return c.json({
      id: statId,
      value,
      formatted,
      format,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
