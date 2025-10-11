import { Hono } from "hono";
import { getStatValue } from "../utils/statFetcher";

export const statRoute = new Hono();

statRoute.get("/:stat", async (c) => {
  const statId = c.req.param("stat");
  const stat = c.req.query();
  try {
    const result = await getStatValue(statId, stat);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
