import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  DEFAULT_OUTPUT_ROOT,
  loadRegistryProviders,
  resolveProvider,
  resolveProviderOutputDir,
} from "./provider.js";
import { buildPublicTypeMap, loadOpenApiDocument } from "./openapi.js";
import {
  renderCopyAssetsScript,
  renderRootClient,
  renderProviderEntry,
  renderProviderReadme,
  renderProviderTypes,
  renderRootPackageEntry,
  renderRootPackageJson,
  renderRootTsconfig,
} from "./render.js";
import { loadProviderTools } from "./utcp.js";

export type GenerateRegistryTypesOptions = {
  provider: string;
  outputRoot?: string;
};

export type GenerateRegistryTypesResult = {
  provider: string;
  outputPaths: string[];
  toolCount: number;
};

async function writeTextFile(filePath: string, contents: string): Promise<string> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, "utf8");
  return filePath;
}

export async function generateRegistryTypes(
  options: GenerateRegistryTypesOptions,
): Promise<GenerateRegistryTypesResult> {
  const providers = await loadRegistryProviders();
  const provider = resolveProvider(providers, options.provider);
  const [{ tools }, openApiDocument] = await Promise.all([loadProviderTools(provider), loadOpenApiDocument(provider)]);
  const publicTypeMap = buildPublicTypeMap(openApiDocument, tools);
  const outputRoot = options.outputRoot ?? DEFAULT_OUTPUT_ROOT;
  const providerDir = resolveProviderOutputDir(provider.name, outputRoot);
  const legacyRuntimePath = path.join(providerDir, "runtime.ts");

  await rm(legacyRuntimePath, { force: true });

  const outputPaths = await Promise.all([
    writeTextFile(path.join(outputRoot, "package.json"), renderRootPackageJson(providers)),
    writeTextFile(path.join(outputRoot, "tsconfig.json"), renderRootTsconfig()),
    writeTextFile(path.join(outputRoot, "index.ts"), renderRootPackageEntry()),
    writeTextFile(path.join(outputRoot, "client.ts"), renderRootClient()),
    writeTextFile(path.join(outputRoot, "copy-assets.mjs"), renderCopyAssetsScript()),
    writeTextFile(path.join(providerDir, "README.md"), renderProviderReadme(provider)),
    writeTextFile(path.join(providerDir, "index.ts"), renderProviderEntry(provider.name)),
    writeTextFile(path.join(providerDir, "types.ts"), renderProviderTypes(provider.name, tools, publicTypeMap)),
    writeTextFile(path.join(providerDir, "openapi.json"), JSON.stringify(openApiDocument, null, 2).concat("\n")),
  ]);

  return {
    provider: provider.name,
    outputPaths,
    toolCount: tools.length,
  };
}
