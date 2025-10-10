import { readFileSync } from "fs";
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

let config: KeisokuConfig | null = null;

export function loadConfig(path = "./keisoku.yaml"): KeisokuConfig {
  if (config) return config;
  const file = readFileSync(path, "utf8");
  config = yaml.load(file) as KeisokuConfig;
  return config;
}
