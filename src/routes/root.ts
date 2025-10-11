import { Hono } from "hono";

export const rootRoute = new Hono();

rootRoute.get("/", (c) => c.json({ message: "Welcome to Keisoku 🐾" }));
