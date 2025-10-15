import { readFileSync, watchFile, existsSync } from "fs";
import yaml from "js-yaml";

export interface StatConfig {
  provider: string;
  metric: string;
  repo?: string;
  cache_ttl?: number;
  format?: "raw" | "compact" | "locale";
  decimals?: number;
}

export interface KeisokuConfig {
  defaults?: {
    format?: "raw" | "compact" | "locale";
    decimals?: number;
  };
  stats: Record<string, StatConfig>;
}

const configCache: Record<string, KeisokuConfig> = {};
const watchers: Record<string, boolean> = {};

function getConfigPath(name?: string): string {
  return name ? `./keisoku-${name}.yaml` : "./keisoku.yaml";
}

export function loadConfig(name?: string): KeisokuConfig {
  const path = getConfigPath(name);
  if (configCache[path]) return configCache[path];

  if (!existsSync(path)) {
    if (name) {
      // Fallback to main config if named config doesn't exist
      return loadConfig();
    }
    throw new Error(`Config file not found: ${path}`);
  }

  const file = readFileSync(path, "utf8");
  const config = yaml.load(file) as KeisokuConfig;
  configCache[path] = config;

  // Watch for changes if not already watching
  if (!watchers[path]) {
    watchFile(path, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log(`Config file changed: ${path}, invalidating cache`);
        delete configCache[path];
      }
    });
    watchers[path] = true;
  }

  return config;
}
