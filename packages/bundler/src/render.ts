import { readFileSync } from "node:fs";

import type { Tool } from "@utcp/sdk";
import type { OpenAPIV3 } from "openapi-types";

import type { ClientToolDefinition, ToolRuntimeMetadata } from "./client-api.js";
import type { RegistryProvider } from "./provider.js";
import {
  getProviderAuthOptions,
  getProviderPackageName,
  getProviderPackageRootName,
  normalizeProviderName,
  resolveRepoPath,
  splitProviderName,
  stripProviderToolName,
} from "./provider.js";
import { escapeComment, quotePropertyName, schemaToTypeScriptType } from "./schema.js";

type PublicToolTypes = {
  inputType: string;
  outputType: string;
};

type ClientTool = {
  accessPath: string[];
  description: string;
  hasInput: boolean;
  hasOptions: boolean;
  inputType: string;
  optionsOptional: boolean;
  optionsType: string;
  outputType: string;
  tags: string[];
};

const VERSION_SUFFIX_PATTERN = /-(\d{8})\.(\d+)$/u;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/u;

function getNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getOpenApiLogoUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  return getNonEmptyString((value as Record<string, unknown>).url);
}

function getProviderOpenApiIcon(
  provider: Pick<RegistryProvider, "options">,
  openApiDocument: OpenAPIV3.Document,
): string | undefined {
  const providerOverride = provider.options?.openapi?.icon?.trim();

  if (providerOverride) {
    return providerOverride;
  }

  const openApiInfo = openApiDocument.info as unknown as Record<string, unknown> | undefined;
  const openApiDocumentRecord = openApiDocument as unknown as Record<string, unknown>;

  return (
    getNonEmptyString(openApiInfo?.icon) ??
    getNonEmptyString(openApiInfo?.["x-icon"]) ??
    getOpenApiLogoUrl(openApiInfo?.["x-logo"]) ??
    getNonEmptyString(openApiDocumentRecord.icon) ??
    getNonEmptyString(openApiDocumentRecord["x-icon"]) ??
    getOpenApiLogoUrl(openApiDocumentRecord["x-logo"])
  );
}

function normalizePackageBaseVersion(rawVersion: string | undefined): string {
  const version = rawVersion?.replace(/^v(?=\d)/u, "");

  if (!version) {
    return "0.0.1";
  }

  if (SEMVER_PATTERN.test(version)) {
    return version;
  }

  const majorMinorMatch = version.match(/^(\d+)\.(\d+)$/u);

  if (majorMinorMatch) {
    const [, major, minor] = majorMinorMatch;
    return `${major}.${minor}.0`;
  }

  const majorOnlyMatch = version.match(/^(\d+)$/u);

  if (majorOnlyMatch) {
    const [, major] = majorOnlyMatch;
    return `${major}.0.0`;
  }

  return "0.0.1";
}

function formatVersionDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function getNextGeneration(previousPackageJson: string | undefined, dateStamp: string): number {
  if (!previousPackageJson) {
    return 1;
  }

  try {
    const parsed = JSON.parse(previousPackageJson) as { version?: unknown };
    const previousVersion = getNonEmptyString(parsed.version);
    const match = previousVersion?.match(VERSION_SUFFIX_PATTERN);

    if (!match) {
      return 1;
    }

    const [, previousDate, previousGeneration] = match;
    return previousDate === dateStamp ? Number(previousGeneration) + 1 : 1;
  } catch {
    return 1;
  }
}

function sanitizeIdentifier(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^[0-9]/, "_$&");
}

function splitIdentifierWords(name: string): string[] {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toPascalCase(name: string): string {
  return sanitizeIdentifier(
    splitIdentifierWords(name)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
      .join(""),
  );
}

function toCamelCase(name: string): string {
  const parts = splitIdentifierWords(name);

  if (parts.length === 0) {
    return "_";
  }

  const [first = "_", ...rest] = parts;
  return sanitizeIdentifier(
    first.toLowerCase() + rest.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()).join(""),
  );
}

function toClientTools(
  provider: Pick<RegistryProvider, "name" | "options">,
  tools: Tool[],
  publicTypeMap: Map<string, PublicToolTypes>,
  clientToolMap: Map<string, ClientToolDefinition>,
): ClientTool[] {
  return tools.map((tool) => {
    const rawToolName = stripProviderToolName(tool.name, provider);
    const generatedMetadata = clientToolMap.get(tool.name);
    const inputType = generatedMetadata?.inputType ?? publicTypeMap.get(tool.name)?.inputType ?? schemaToTypeScriptType(tool.inputs);

    return {
      accessPath: generatedMetadata?.accessPath ?? [sanitizeIdentifier(rawToolName)],
      description: tool.description,
      hasInput: generatedMetadata?.hasInput ?? inputType !== "{}",
      hasOptions: generatedMetadata?.hasOptions ?? false,
      inputType,
      optionsOptional: generatedMetadata?.optionsOptional ?? true,
      optionsType: generatedMetadata?.optionsType ?? "{}",
      outputType: publicTypeMap.get(tool.name)?.outputType ?? schemaToTypeScriptType(tool.outputs),
      tags: tool.tags,
    };
  });
}

export function renderProviderTypes(
  provider: Pick<RegistryProvider, "name" | "options">,
  tools: Tool[],
  publicTypeMap: Map<string, PublicToolTypes>,
  clientToolMap: Map<string, ClientToolDefinition>,
): string {
  const clientTools = toClientTools(provider, tools, publicTypeMap, clientToolMap);
  const providerTypeName = toPascalCase(provider.name);

  type ClientTreeNode = {
    children: Map<string, ClientTreeNode>;
    tool?: ClientTool;
  };

  function createClientTreeNode(): ClientTreeNode {
    return {
      children: new Map(),
    };
  }

  function insertClientTool(root: ClientTreeNode, tool: ClientTool): void {
    let current = root;

    for (const segment of tool.accessPath) {
      const child = current.children.get(segment) ?? createClientTreeNode();
      current.children.set(segment, child);
      current = child;
    }

    current.tool = tool;
  }

  function renderClientTree(node: ClientTreeNode, depth: number): string {
    return [...node.children.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([segment, child]) => {
        const indent = "  ".repeat(depth);

        if (child.tool) {
          const parameters = [
            child.tool.hasInput ? `input: ${child.tool.inputType}` : undefined,
            child.tool.hasOptions ? `options${child.tool.optionsOptional ? "?" : ""}: ${child.tool.optionsType}` : undefined,
          ].filter((parameter): parameter is string => Boolean(parameter));
          const invocation = [
            child.tool.hasInput ? "input" : undefined,
            child.tool.hasOptions ? "options" : undefined,
          ].filter((argument): argument is string => Boolean(argument));

          return [
            `${indent}/**`,
            `${indent} * ${escapeComment(child.tool.description)}`,
            `${indent} * Tags: ${escapeComment(child.tool.tags.join(", "))}`,
            `${indent} * Access as: ${provider.name}.${child.tool.accessPath.join(".")}(${invocation.join(", ")})`,
            `${indent} */`,
            `${indent}${quotePropertyName(segment)}: (${parameters.join(", ")}) => Promise<${child.tool.outputType}>;`,
          ].join("\n");
        }

        return [
          `${indent}${quotePropertyName(segment)}: {`,
          renderClientTree(child, depth + 1),
          `${indent}};`,
        ].join("\n");
      })
      .join("\n");
  }

  const clientTree = createClientTreeNode();

  for (const clientTool of clientTools) {
    insertClientTool(clientTree, clientTool);
  }

  const groupTypeEntries = renderClientTree(clientTree, 1);

  return [
    `export type ${providerTypeName}Client = {`,
    groupTypeEntries,
    "};",
    "",
  ].join("\n");
}

export function renderProviderEntry(providerName: string, clientImportPath = "../client.js"): string {
  const providerTypeName = toPascalCase(providerName);

  return `import type { CreateClientOptions } from ${JSON.stringify(clientImportPath)};
import { createClient, createLazyClient } from ${JSON.stringify(clientImportPath)};
import type { ${providerTypeName}Client } from "./types.js";
import { toolMetadata } from "./metadata.js";
import openApiDocument from "./openapi.json" with { type: "json" };

export * from "./types.js";

export function create${providerTypeName}Client(
  options: Omit<CreateClientOptions, "name" | "openApiDocument" | "toolMetadata"> = {},
): Promise<${providerTypeName}Client> {
  return createClient<${providerTypeName}Client>({
    ...options,
    name: ${JSON.stringify(providerName)},
    openApiDocument,
    toolMetadata,
  });
}

const defaultClient = createLazyClient(() => create${providerTypeName}Client());

export default defaultClient;
`;
}

export function renderProviderMetadata(
  provider: Pick<RegistryProvider, "name" | "options">,
  clientToolMap: Map<string, ClientToolDefinition>,
  clientImportPath = "../client.js",
): string {
  const toolMetadata = Object.fromEntries(
    [...clientToolMap.entries()].map(([toolName, definition]) => {
      return [stripProviderToolName(toolName, provider), definition.runtimeMetadata];
    }),
  ) as Record<string, ToolRuntimeMetadata>;

  return `import type { ToolRuntimeMetadataMap } from ${JSON.stringify(clientImportPath)};

export const toolMetadata = ${JSON.stringify(toolMetadata, null, 2)} satisfies ToolRuntimeMetadataMap;
`;
}

export function renderRootClient(): string {
  return readFileSync(resolveRepoPath("packages", "utdk", "client.ts"), "utf8");
}

export function renderRootPackageEntry(): string {
  return `export { createClient, createLazyClient } from "./client.js";
export type { CreateClientOptions } from "./client.js";
`;
}

export function renderRootPackageJson(providers: RegistryProvider[]): string {
  const providerExports = Object.fromEntries(
    [...new Set(providers.flatMap((provider) => {
      const segments = splitProviderName(provider.name);
      return segments.map((_, index) => segments.slice(0, index + 1).join("/"));
    }))]
      .sort((left, right) => left.localeCompare(right))
      .map((providerPath) => [
        `./${providerPath}`,
        {
          types: `./dist/${providerPath}/index.d.ts`,
          import: `./dist/${providerPath}/index.js`,
          default: `./dist/${providerPath}/index.js`,
        },
      ]),
  );

  return JSON.stringify(
    {
      name: "utdk",
      version: "0.1.0",
      private: true,
      type: "module",
      description: "Generated UTDK provider clients",
      scripts: {
        build: "tsc -p tsconfig.json && node ./copy-assets.mjs",
        "check-types": "tsc -p tsconfig.json --noEmit",
        typecheck: "tsc -p tsconfig.json --noEmit",
        clean: "rm -rf dist",
      },
      dependencies: {
        "@utcp/http": "^1.1.1",
        "@utcp/sdk": "^1.1.0",
      },
      exports: {
        ".": {
          types: "./dist/index.d.ts",
          import: "./dist/index.js",
          default: "./dist/index.js",
        },
        "./client": {
          types: "./dist/client.d.ts",
          import: "./dist/client.js",
          default: "./dist/client.js",
        },
        ...providerExports,
      },
    },
    null,
    2,
  ).concat("\n");
}

export function renderRootTsconfig(): string {
  return JSON.stringify(
    {
      extends: "../../tsconfig.json",
      compilerOptions: {
        moduleResolution: "Bundler",
        outDir: "dist",
        rootDir: ".",
        declaration: true,
        sourceMap: true,
      },
      include: ["./**/*.ts"],
    },
    null,
    2,
  ).concat("\n");
}

export function renderCopyAssetsScript(): string {
  return `import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, "dist");
const skippedRootFiles = new Set(["package.json", "tsconfig.json"]);

async function copyAssets(currentDir, relativeDir = '') {
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === 'dist' || entry.name === 'node_modules') {
      continue;
    }

    const sourcePath = path.join(currentDir, entry.name);
    const relativePath = path.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      await copyAssets(sourcePath, relativePath);
      continue;
    }

    if (!entry.name.endsWith('.json')) {
      continue;
    }

    if (relativeDir === '' && skippedRootFiles.has(entry.name)) {
      continue;
    }

    const destinationPath = path.join(distDir, relativePath);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await cp(sourcePath, destinationPath);
  }
}

await copyAssets(rootDir);
`;
}

export function renderProviderReadme(provider: RegistryProvider): string {
  return `# ${provider.name}\n\nGenerated UTDK provider types and OpenAPI-backed client for ${provider.url}.\n`;
}

export function renderNamespaceEntry(namespaceSegments: string[], providers: RegistryProvider[]): string {
  const childExports = new Map<string, string>();

  for (const provider of providers) {
    const providerSegments = splitProviderName(provider.name);
    const matchesNamespace = namespaceSegments.every((segment, index) => providerSegments[index] === segment);

    if (!matchesNamespace || providerSegments.length <= namespaceSegments.length) {
      continue;
    }

    const childSegment = providerSegments[namespaceSegments.length];

    if (!childSegment) {
      continue;
    }

    childExports.set(childSegment, toCamelCase(childSegment));
  }

  return [...childExports.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([segment, identifier]) =>
        `export * from "./${segment}/index.js";\nexport { default as ${identifier} } from "./${segment}/index.js";`,
    )
    .join("\n\n")
    .concat("\n");
}

export function renderNamespacePackageJson(
  providerName: string,
  providers: RegistryProvider[],
  previousPackageJson?: string,
  generatedAt: Date = new Date(),
): string {
  const packageRootName = getProviderPackageRootName(providerName);
  const dateStamp = formatVersionDate(generatedAt);
  const generation = getNextGeneration(previousPackageJson, dateStamp);
  const normalizedProviders = providers.map((provider) => normalizeProviderName(provider.name)).sort((left, right) => left.localeCompare(right));

  return JSON.stringify(
    {
      name: getProviderPackageName(providerName),
      version: `0.0.1-${dateStamp}.${generation}`,
      type: "module",
      description: `Generated UTDK provider clients for ${packageRootName}.`,
      keywords: [packageRootName, "generated", "openapi", "utdk"],
      utdk: {
        namespace: packageRootName,
        generation,
        generatedAt: generatedAt.toISOString(),
        providers: normalizedProviders,
      },
    },
    null,
    2,
  ).concat("\n");
}

export function renderProviderPackageJson(
  provider: RegistryProvider,
  openApiDocument: OpenAPIV3.Document,
  previousPackageJson?: string,
  generatedAt: Date = new Date(),
  options: {
    includePackageName?: boolean;
  } = {},
): string {
  const includePackageName = options.includePackageName ?? true;
  const sourceVersion = getNonEmptyString(openApiDocument.info?.version);
  const baseVersion = normalizePackageBaseVersion(sourceVersion);
  const dateStamp = formatVersionDate(generatedAt);
  const generation = getNextGeneration(previousPackageJson, dateStamp);
  const title = getNonEmptyString(openApiDocument.info?.title);
  const description =
    getNonEmptyString(openApiDocument.info?.description) ??
    `Generated UTDK provider types and OpenAPI-backed client for ${provider.url}.`;
  const packageDescription = title ? `Generated UTDK provider client for ${title}. ${description}` : description;
  const license = getNonEmptyString(openApiDocument.info?.license?.name);
  const homepage =
    getNonEmptyString(openApiDocument.externalDocs?.url) ??
    getNonEmptyString(openApiDocument.info?.contact?.url) ??
    provider.url;
  const auth = getProviderAuthOptions(provider.options);
  const icon = getProviderOpenApiIcon(provider, openApiDocument);

  const packageJson = {
    ...(includePackageName ? { name: `@utdk/${provider.name}` } : { private: true }),
    version: `${baseVersion}-${dateStamp}.${generation}`,
    type: "module",
    description: packageDescription,
    homepage,
    keywords: [provider.name, "generated", "openapi", "utdk"],
    ...(license ? { license } : {}),
    utdk: {
      provider: provider.name,
      generation,
      generatedAt: generatedAt.toISOString(),
      auth,
      openapi: {
        title,
        url: provider.url,
        version: sourceVersion ?? null,
        termsOfService: getNonEmptyString(openApiDocument.info?.termsOfService) ?? null,
        ...(icon ? { icon } : {}),
      },
    },
  };

  return JSON.stringify(packageJson, null, 2).concat("\n");
}
