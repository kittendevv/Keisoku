import { loadConfig } from "./config";
import { formatValue } from "./formatter";
import { getProvider, loadProviders } from "./providers";

export async function getStatValue(statId: string, name?: string) {
  const config = loadConfig(name);
  const stat = config.stats[statId];
  if (!stat) throw new Error(`Unknown stat: ${statId}`);

  let value: number | string;

  if (!getProvider(stat.provider)) {
    await loadProviders();
  }

  const provider = getProvider(stat.provider);
  if (!provider) throw new Error(`Unsupported provider: ${stat.provider}`);

  value = await provider.fetch(statId, stat);

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
