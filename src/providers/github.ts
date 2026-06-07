import type { Provider } from "./types";

export function github_stars(cfg: { repo: string }): Provider {
  return {
    name: `github.stars.${cfg.repo}`,
    async fetch() {
      const res = await fetch(`https://api.github.com/repos/${cfg.repo}`);
      const data = await res.json();
      return { stars: data.stargazers_count };
    },
  };
}

export function github_package_downloads(cfg: {
  repo: string;
  package: string;
}): Provider {
  return {
    name: `github.downloads.${cfg.package}`,
    async fetch() {
      const res = await fetch(
        `https://github.com/${cfg.repo}/pkgs/container/${cfg.package}`,
      );
      const html = await res.text();
      const match = html.match(
        /<span[^>]*>Total downloads<\/span>\s*<h3 title="(\d+)">/i,
      );
      if (!match) throw new Error("Unable to find download count");
      return { downloads: parseInt(match[1].replace(/,/g, "")) };
    },
  };
}
