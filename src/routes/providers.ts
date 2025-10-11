import { Hono } from "hono";
import { listProviders } from "../utils/providers";

export const providersRoute = new Hono();

providersRoute.get("/providers", async (c) => {
  const data = listProviders();
  return c.json({
    count: data.length,
    providers: data,
  });
});
