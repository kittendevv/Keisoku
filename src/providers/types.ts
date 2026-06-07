export interface Provider {
  name: string;
  fetch: () => Promise<Record<string, number>>;
}
