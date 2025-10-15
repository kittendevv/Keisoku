export interface ProviderMetadata {
    name: string;
    description?: string;
    version?: string;
    author?: string;
  }
  
  export interface ProviderHandler {
    meta: ProviderMetadata;
    fetch(statId: string, statConfig: Record<string, any>): Promise<number | string>;
  }
  