import { Hono } from "hono";
import { getAllStats } from "../utils/statFetcher";

export const allRoute = new Hono();

allRoute.get("/all", async (c) => {
  const name = c.req.param("name");
  const results = await getAllStats(name);
  return c.json(results);
});
