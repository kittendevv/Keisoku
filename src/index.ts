import { Elysia } from "elysia";
import { loadProviders } from "./config";

const providers = await loadProviders();

const app = new Elysia()
  .get("/", () => "Keisoku API, visit /api/docs for API documentation")
  .get("/stats", async () => {
    const results = await Promise.allSettled(providers.map((p) => p.fetch()));
    return Object.fromEntries(
      providers.map((p, i) => [
        p.name,
        results[i].status === "fulfilled"
          ? results[i].value
          : { error: (results[i] as PromiseRejectedResult).reason?.message },
      ]),
    );
  })
  .listen(3000);

console.log(
  `Keisoku is running at ${app.server?.hostname}:${app.server?.port}`,
);
