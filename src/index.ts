import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { cors } from "@elysiajs/cors";
import { loadConfig } from "./config";
import { formatValue } from "./format";

const { providers, port } = await loadConfig();

const app = new Elysia()
  .use(cors())
  .use(openapi())
  .get("/", () => "Keisoku API, visit /openapi for API documentation")
  .get("/api/all", async () => {
    const results = await Promise.allSettled(providers.map((p) => p.fetch()));
    return Object.fromEntries(
      providers.map((p, i) => {
        if (results[i].status === "rejected")
          return [
            p.name,
            { error: (results[i] as PromiseRejectedResult).reason?.message },
          ];

        const raw = (
          results[i] as PromiseFulfilledResult<Record<string, number>>
        ).value;
        const formatted = p.format
          ? Object.fromEntries(
              Object.entries(raw).map(([k, v]) => [
                k,
                { raw: v, formatted: formatValue(v, p.format) },
              ]),
            )
          : raw;

        return [p.name, formatted];
      }),
    );
  })
  .listen(port);

console.log(
  `Keisoku is running at ${app.server?.hostname}:${app.server?.port}`,
);
