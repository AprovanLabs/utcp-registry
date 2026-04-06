import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type RegistryProvider = {
  name: string;
  provider_type?: string;
  http_method?: string;
  url: string;
  content_type?: string;
};

export const REGISTRY_PATH = resolveRepoPath("data", "registry.json");
export const DEFAULT_OUTPUT_ROOT = resolveRepoPath("packages", "utdk");

export function resolveRepoPath(...segments: string[]): string {
  return path.join(fileURLToPath(new URL("../../..", import.meta.url)), ...segments);
}

export async function loadRegistryProviders(): Promise<RegistryProvider[]> {
  const rawRegistry = await readFile(REGISTRY_PATH, "utf8");
  return JSON.parse(rawRegistry) as RegistryProvider[];
}

export function resolveProvider(providers: RegistryProvider[], providerName: string): RegistryProvider {
  const provider = providers.find((entry) => entry.name === providerName);

  if (!provider) {
    throw new Error(`Provider "${providerName}" was not found in ${REGISTRY_PATH}.`);
  }

  if (!provider.url) {
    throw new Error(`Provider "${providerName}" is missing a URL in ${REGISTRY_PATH}.`);
  }

  if ((provider.provider_type ?? "http") !== "http") {
    throw new Error(`Provider "${providerName}" uses unsupported type "${provider.provider_type}".`);
  }

  return provider;
}

export function resolveProviderOutputDir(providerName: string, outputRoot: string): string {
  return path.join(outputRoot, providerName);
}
