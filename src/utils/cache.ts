import NodeCache from "node-cache";

export const cache = new NodeCache();

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

export function setCached<T>(key: string, value: T, ttl: number) {
  cache.set(key, value, ttl);
}
