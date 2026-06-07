import * as github from "./github";

const modules: Record<string, Record<string, any>> = {
  "./github": github,
};

export function getProvider(type: string, path: string) {
  const mod = modules[path];
  return mod?.[type];
}
