import { ProviderHandler } from "../types/provider";
import NodeCache from "node-cache";

const cache = new NodeCache();

export async function fetchNpmMetric(statId: string, statConfig: Record<string, any>): Promise<number | string> {
  const cacheKey = `npm-${statId}-${JSON.stringify(statConfig.params || {})}`;
  const cached = cache.get<number | string>(cacheKey);
  if (cached !== undefined) return cached;

  const { package: pkg, metric, cache_ttl, params } = statConfig;
  const baseUrl = "https://api.npmjs.org";

  let value: number | string = 0;

  switch (metric) {
    case "downloads": {
      const period = params?.period || "last-month";
      const res = await fetch(`${baseUrl}/downloads/point/${period}/${pkg}`);
      const data = await res.json();
      value = data.downloads || 0;
      break;
    }
    case "version": {
      const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
      const data = await res.json();
      value = data.version || "unknown";
      break;
    }
    default:
      throw new Error(`Unsupported metric: ${metric}`);
  }

  cache.set(cacheKey, value, cache_ttl || 3600);
  return value;
}

const npmProvider: ProviderHandler = {
  meta: {
    name: "npm",
    description: "Fetch package statistics from npm registry",
    version: "1.0.0",
    author: "CodingKitten",
  },

  fetch: fetchNpmMetric,
};

export default npmProvider;
