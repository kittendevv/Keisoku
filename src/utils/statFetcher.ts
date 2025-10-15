import { loadConfig } from "./config";
import { fetchGithubMetric } from "../providers/github";
import { fetchNpmMetric } from "../providers/npm";
import { formatValue } from "./formatter";

export async function getStatValue(statId: string, name?: string) {
  const config = loadConfig(name);
  const stat = config.stats[statId];
  if (!stat) throw new Error(`Unknown stat: ${statId}`);

  let value: number | string;

  switch (stat.provider) {
    case "github":
      value = await fetchGithubMetric(statId, stat);
      break;
    case "npm":
      value = await fetchNpmMetric(statId, stat);
      break;
    default:
      throw new Error(`Unsupported provider: ${stat.provider}`);
  }

  const format = stat.format ?? config.defaults?.format ?? "raw";
  const decimals = stat.decimals ?? config.defaults?.decimals ?? 1;
  const formatted = typeof value === 'number' ? formatValue(value, { format, decimals }) : value;

  return {
    id: statId,
    value,
    formatted,
    format,
    updated_at: Date.now(),
  };
}

export async function getAllStats(name?: string) {
  const config = loadConfig(name);
  const results: Record<string, any> = {};

  for (const statId of Object.keys(config.stats)) {
    try {
      results[statId] = await getStatValue(statId, name);
    } catch (error) {
      results[statId] = { error: (error as Error).message };
    }
  }

  return results;
}
