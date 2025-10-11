import { ProviderHandler } from "../types/provider";
import NodeCache from "node-cache";
import { loadConfig } from "../utils/config";

const cache = new NodeCache();

const githubProvider: ProviderHandler = {
  meta: {
    name: "GitHub",
    description: "Fetch repository stats from GitHub (stars, forks, issues)",
    version: "1.0.0",
    author: "CodingKitten",
  },

  async fetch(statId, statConfig) {
    const cacheKey = `github-${statId}`;
    const cached = cache.get<number>(cacheKey);
    if (cached) return cached;

    const { repo, metric, cache_ttl } = statConfig;
    const token = process.env.GITHUB_TOKEN;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    const data = await res.json();

    let value = 0;
    switch (metric) {
      case "stars":
        value = data.stargazers_count;
        break;
      case "forks":
        value = data.forks_count;
        break;
      case "issues":
        value = data.open_issues_count;
        break;
      default:
        throw new Error(`Unsupported metric: ${metric}`);
    }

    cache.set(cacheKey, value, cache_ttl || 3600);
    return value;
  },
};

export default githubProvider;
