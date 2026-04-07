import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type RegistryProvider = {
  name: string;
  options?: RegistryProviderOptions;
  provider_type?: string;
  http_method?: string;
  url: string;
  content_type?: string;
};

export type RegistryProviderAuthOption = Record<string, unknown>;

export type RegistryProviderOptions = {
  auth?: RegistryProviderAuthOption | RegistryProviderAuthOption[];
  openapi?: RegistryProviderOpenApiOptions;
  operations?: RegistryProviderOperationsOptions;
};

export type RegistryProviderOpenApiOptions = {
  icon?: string;
};

export type RegistryProviderOperationsOptions = {
  stripPrefix?: string;
};

export const REGISTRY_PATH = resolveRepoPath("data", "registry.json");
export const DEFAULT_OUTPUT_ROOT = resolveRepoPath("packages", "utdk");
export const DEFAULT_DOCS_CACHE_ROOT = resolveRepoPath(".registry");

export function resolveRepoPath(...segments: string[]): string {
  return path.join(fileURLToPath(new URL("../../..", import.meta.url)), ...segments);
}

export function splitProviderName(providerName: string): string[] {
  const segments = providerName
    .split(/[./]/u)
    .map((segment) => segment.trim())
    .filter(Boolean);

  return segments.length > 0 ? segments : [providerName];
}

export function normalizeProviderName(providerName: string): string {
  return splitProviderName(providerName).join("/");
}

export function getProviderPackageRootName(providerName: string): string {
  return splitProviderName(providerName)[0] ?? providerName;
}

export function getProviderPackageSubpath(providerName: string): string | undefined {
  const segments = splitProviderName(providerName);
  return segments.length > 1 ? segments.slice(1).join("/") : undefined;
}

export function getProviderPackageName(providerName: string): string {
  return `@utdk/${getProviderPackageRootName(providerName)}`;
}

export function getProviderClientImportPath(providerName: string): string {
  return `${"../".repeat(splitProviderName(providerName).length)}client.js`;
}

export function getPrimaryProviderAuthOption(
  providerOptions?: RegistryProviderOptions,
): RegistryProviderAuthOption | undefined {
  return getProviderAuthOptions(providerOptions)[0];
}

export function getProviderAuthOptions(
  providerOptions?: RegistryProviderOptions,
): RegistryProviderAuthOption[] {
  const auth = providerOptions?.auth;

  if (!auth) {
    return [];
  }

  return Array.isArray(auth) ? auth : [auth];
}

function getProviderToolPrefixes(providerName: string): string[] {
  const normalizedProviderName = normalizeProviderName(providerName);
  const dottedProviderName = normalizedProviderName.replace(/\//g, ".");

  return [...new Set([providerName, normalizedProviderName, dottedProviderName])]
    .filter(Boolean)
    .map((prefix) => `${prefix}.`);
}

function stripCustomOperationPrefix(
  toolName: string,
  providerOptions?: RegistryProviderOptions,
): string {
  const stripPrefix = providerOptions?.operations?.stripPrefix?.trim();

  return stripPrefix && toolName.startsWith(stripPrefix) ? toolName.slice(stripPrefix.length) : toolName;
}

export function stripProviderToolName(toolName: string, provider: Pick<RegistryProvider, "name" | "options">): string {
  for (const prefix of getProviderToolPrefixes(provider.name)) {
    if (toolName.startsWith(prefix)) {
      return stripCustomOperationPrefix(toolName.slice(prefix.length), provider.options);
    }
  }

  const fallbackSegments = toolName.split(".");
  const fallbackToolName = fallbackSegments.length > 1 ? fallbackSegments.slice(1).join(".") : toolName;
  return stripCustomOperationPrefix(fallbackToolName, provider.options);
}

export async function loadRegistryProviders(): Promise<RegistryProvider[]> {
  const rawRegistry = await readFile(REGISTRY_PATH, "utf8");
  return JSON.parse(rawRegistry) as RegistryProvider[];
}

export function resolveProvider(providers: RegistryProvider[], providerName: string): RegistryProvider {
  const normalizedProviderName = normalizeProviderName(providerName);
  const provider = providers.find((entry) => normalizeProviderName(entry.name) === normalizedProviderName);

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
  return path.join(outputRoot, ...splitProviderName(providerName));
}

export function resolveProviderPackageRootDir(providerName: string, outputRoot: string): string {
  return path.join(outputRoot, getProviderPackageRootName(providerName));
}

export function resolveProviderDocsCacheDir(providerName: string, docsCacheRoot = DEFAULT_DOCS_CACHE_ROOT): string {
  return path.join(docsCacheRoot, ...splitProviderName(providerName));
}

export function resolveProviderDocsManifestPath(providerName: string, docsCacheRoot = DEFAULT_DOCS_CACHE_ROOT): string {
  return path.join(resolveProviderDocsCacheDir(providerName, docsCacheRoot), "manifest.json");
}

export function resolveProviderDocsSourcesDir(providerName: string, docsCacheRoot = DEFAULT_DOCS_CACHE_ROOT): string {
  return path.join(resolveProviderDocsCacheDir(providerName, docsCacheRoot), "sources");
}

export function resolveProviderDocsIndexPath(providerName: string, docsCacheRoot = DEFAULT_DOCS_CACHE_ROOT): string {
  return path.join(resolveProviderDocsCacheDir(providerName, docsCacheRoot), "index.md");
}

export function resolveProviderDocsOutputDir(providerName: string, outputRoot = DEFAULT_OUTPUT_ROOT): string {
  return path.join(resolveProviderOutputDir(providerName, outputRoot), "docs");
}
