import { getCached, setCached } from "../utils/cache";
import { KeisokuConfig, StatConfig } from "../utils/config";

const GITHUB_API = "https://api.github.com";

export async function fetchGithubMetric(statId: string, config: StatConfig) {
  const cacheKey = `github:${statId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  if (!config.repo) {
    throw new Error(`Missing "repo" for ${statId}`);
  }

  const url = `${GITHUB_API}/repos/${config.repo}`;
  const headers: Record<string, string> = {
    "User-Agent": "keisoku",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API error for ${config.repo}`);

  const data = await res.json();
  let value: number;

  switch (config.metric) {
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
      throw new Error(`Unsupported metric: ${config.metric}`);
  }

  setCached(cacheKey, value, config.cache_ttl ?? 3600);
  return value;
}
