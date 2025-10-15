import { ProviderHandler } from "../types/provider";
import NodeCache from "node-cache";
import { loadConfig } from "../utils/config";

const cache = new NodeCache();

export async function fetchGithubMetric(statId: string, statConfig: Record<string, any>): Promise<number> {
  const cacheKey = `github-${statId}`;
  const cached = cache.get<number>(cacheKey);
  if (cached) return cached;

  const { repo, metric, cache_ttl, package: pkg } = statConfig;
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let value = 0;

  if (metric === "downloads") {
    if (!pkg) throw new Error("Package name required for downloads metric");
    const [owner, repoName] = repo.split('/');
    const url = `https://github.com/${owner}/${repoName}/pkgs/container/${pkg}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Failed to fetch from GitHub: ${res.status}`);
    const html = await res.text();
    const totalDownloadsMatch = html.match(/<span class="d-block color-fg-muted text-small mb-1">Total downloads<\/span>\s*<h3 title="(\d+)">([^<]+)<\/h3>/i);
    if (totalDownloadsMatch) {
      value = parseInt(totalDownloadsMatch[1]);
    } else {
      throw new Error("Could not find download count in HTML");
    }
  } else {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    const data = await res.json();

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
  }

  cache.set(cacheKey, value, cache_ttl || 3600);
  return value;
}const githubProvider: ProviderHandler = {
  meta: {
    name: "GitHub",
    description: "Fetch repository stats from GitHub (stars, forks, issues, downloads)",
    version: "1.0.0",
    author: "CodingKitten",
  },

  fetch: fetchGithubMetric,
};

export default githubProvider;
