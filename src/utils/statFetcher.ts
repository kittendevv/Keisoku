import { loadConfig } from "./config";
import { fetchGithubMetric } from "../providers/github";
import { formatValue } from "./formatter";

const config = loadConfig();

export async function getStatValue(statId: string) {
  const stat = config.stats[statId];
  if (!stat) throw new Error(`Unknown stat: ${statId}`);

  let value: number;

  switch (stat.provider) {
    case "github":
      value = await fetchGithubMetric(statId, stat);
      break;
    default:
      throw new Error(`Unsupported provider: ${stat.provider}`);
  }

  const format = stat.format ?? config.defaults?.format ?? "raw";
  const decimals = stat.decimals ?? config.defaults?.decimals ?? 1;
  const formatted = formatValue(value, { format, decimals });

  return {
    id: statId,
    value,
    formatted,
    format,
    updated_at: Date.now(),
  };
}
