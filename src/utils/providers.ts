import fs from "fs";
import path from "path";
import type { ProviderHandler, ProviderMetadata } from "../types/provider";

type ProviderMetaEntry = {
  file: string;
  id: string;
  meta: ProviderMetadata;
};

const providers: Record<string, ProviderHandler> = {};
let providersMeta: ProviderMetaEntry[] | null = null;

function readProvidersMeta(): ProviderMetaEntry[] {
  if (providersMeta) return providersMeta;

  const providersDir = path.join(import.meta.dir, "../providers");
  const metaFile = path.join(providersDir, "all.json");
  const raw = fs.readFileSync(metaFile, "utf8");
  providersMeta = JSON.parse(raw) as ProviderMetaEntry[];

  return providersMeta;
}

export async function loadProviders() {
  const providersDir = path.join(import.meta.dir, "../providers");
  const metaEntries = readProvidersMeta();

  for (const entry of metaEntries) {
    const module = await import(path.join(providersDir, entry.file));
    const provider = module.default as ProviderHandler;

    if (!provider?.meta || !provider?.fetch) {
      console.warn(`⚠️  Provider "${entry.id}" is missing required fields.`);
      continue;
    }

    providers[entry.id] = provider;
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
