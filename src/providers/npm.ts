import type { Provider } from "./types";

export function npm_downloads(cfg: {
  package: string;
  period?: string;
}): Provider {
  return {
    name: `npm.downloads.${cfg.package}`,
    async fetch() {
      const period = cfg.period ?? "last-month";
      const res = await fetch(
        `https://api.npmjs.org/downloads/point/${period}/${cfg.package}`,
      );
      const data = await res.json();
      return { downloads: data.downloads };
    },
  };
}
