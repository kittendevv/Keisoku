import { readFileSync } from "fs";

export async function loadProviders() {
  const raw = readFileSync("./keisoku.toml", "utf-8");
  const config = Bun.TOML.parse(raw) as {
    metrics: Record<string, { provider: string; [key: string]: any }>;
  };

  const entries = Object.entries(config.metrics);
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
      return { name, format: source.format, ...factory(source) };
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
      return {
        name,
        format: source.format,
        ...sum({ name, ...source }, resolved),
      };
    }),
  );

  return [...providers, ...sumProviders];
}
