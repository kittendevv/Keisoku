import { Hono } from "hono";
import { getStatValue } from "../utils/statFetcher";

export const statRoute = new Hono();

statRoute.get("/:stat", async (c) => {
  const name = c.req.param("name");
  const statId = c.req.param("stat");
  try {
    const result = await getStatValue(statId, name);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});
