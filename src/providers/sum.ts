import type { Provider } from "./types";

export function sum(
  cfg: { name: string; of: string[] },
  resolved: Record<string, Record<string, number>>,
): Provider {
  return {
    name: cfg.name,
    async fetch() {
      const total = cfg.of.reduce((acc, key) => {
        const metric = resolved[key];
        if (!metric) throw new Error(`Sum references unknown metric: ${key}`);
        const value = Object.values(metric)[0];
        return acc + (value ?? 0);
      }, 0);
      return { total };
    },
  };
}
