import fs from "fs";
import path from "path";
import type { ProviderHandler } from "../types/provider";

type ProviderMetaEntry = {
  file: string;
  id: string;
  meta: ProviderHandler["meta"];
};

async function main() {
  const providersDir = path.join(import.meta.dir, "../providers");
  const outFile = path.join(providersDir, "all.json");

  const entries = fs.readdirSync(providersDir);
  const results: ProviderMetaEntry[] = [];

  for (const file of entries) {
    if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;
    if (file === "all.json") continue;

    const providerName = path.basename(file, path.extname(file));
    const module = await import(path.join(providersDir, file));
    const provider = module.default as ProviderHandler | undefined;

    if (!provider?.meta) continue;

    results.push({
      file,
      id: providerName,
      meta: provider.meta,
    });

    console.log("Processed provider:", providerName);
  }

  fs.writeFileSync(outFile, JSON.stringify(results, null, 2), "utf8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});