import fs from "fs";
import path from "path";
import type { ProviderHandler } from "../types/provider";

const providers: Record<string, ProviderHandler> = {};

export async function loadProviders() {
  const providersDir = path.join(import.meta.dir, "../providers");
  const files = fs.readdirSync(providersDir);

  for (const file of files) {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const providerName = path.basename(file, path.extname(file));
      const module = await import(path.join(providersDir, file));
      const provider = module.default as ProviderHandler;

      if (!provider.meta || !provider.fetch) {
        console.warn(`⚠️  Provider "${providerName}" is missing required fields.`);
        continue;
      }

      providers[providerName] = provider;
    }
  }

  console.log(
    `✅ Loaded ${Object.keys(providers).length} provider(s): ${Object.keys(providers).join(", ")}`
  );

  return providers;
}

export function getProvider(name: string): ProviderHandler | undefined {
  return providers[name];
}

export function listProviders() {
  return Object.entries(providers).map(([id, p]) => ({
    id,
    ...p.meta,
  }));
}
