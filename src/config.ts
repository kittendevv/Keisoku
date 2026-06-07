import { readFileSync } from "fs";

async function resolveProviders(
  metrics: Record<string, { provider: string; [key: string]: any }>,
) {
  const entries = Object.entries(metrics);
  const regular = entries.filter(([, s]) => s.provider !== "sum");
  const sums = entries.filter(([, s]) => s.provider === "sum");

  // pass 1 — resolve real providers
  const providers = await Promise.all(
    regular.map(async ([name, source]) => {
      const [prefix] = source.provider.split("_");
      const mod = await import(`./providers/${prefix}`);
      const factory = mod[source.provider];
      if (!factory)
        throw new Error(
          `No export '${source.provider}' in providers/${prefix}.ts`,
        );
      return { ...factory(source), name, format: source.format };
    }),
  );

  // pass 2 — fetch real providers so sums can reference them
  const resolved: Record<string, Record<string, number>> = {};
  await Promise.allSettled(
    regular.map(async ([tomlName], i) => {
      resolved[tomlName] = await providers[i].fetch();
    }),
  );

  // pass 3 — build sum providers
  const sumProviders = await Promise.all(
    sums.map(async ([name, source]) => {
      const { sum } = await import("./providers/sum");
      const { fetch } = sum({ name, of: source.of }, resolved);
      return { name, format: source.format, fetch };
    }),
  );

  return [...providers, ...sumProviders];
}

export async function loadConfig() {
  const raw = readFileSync("./keisoku.toml", "utf-8");
  const config = Bun.TOML.parse(raw) as {
    server?: { port?: number };
    metrics: Record<string, { provider: string; [key: string]: any }>;
  };

  return {
    port: config.server?.port ?? 3000,
    providers: await resolveProviders(config.metrics),
  };
}
