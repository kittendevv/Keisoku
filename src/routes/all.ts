import { Hono } from "hono";
import { loadConfig } from "../utils/config";
import { getStatValue } from "../utils/statFetcher";

export const allRoute = new Hono();
const config = loadConfig();

allRoute.get("/all", async (c) => {
  const results: Record<string, any> = {};

  for (const statId in config.stats) {
    try {
      const { id, ...rest } = await getStatValue(statId);
      results[statId] = rest;
    } catch (err: any) {
      results[statId] = { error: err.message };
    }
  }

  return c.json(results);
});
