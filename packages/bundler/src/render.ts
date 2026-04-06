import type { Tool } from "@utcp/sdk";

import type { RegistryProvider } from "./provider.js";
import { escapeComment, quotePropertyName, schemaToObjectContent, schemaToTypeScriptType } from "./schema.js";

type PublicToolTypes = {
  inputType: string;
  outputType: string;
};

type ClientTool = {
  groupName: string;
  inputType: string;
  interfaceName: string;
  methodName: string;
  outputType: string;
};

function sanitizeIdentifier(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^[0-9]/, "_$&");
}

function toCamelCase(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (cleaned.length === 0) {
    return "_";
  }

  const first = cleaned[0] ?? "_";
  const rest = cleaned.slice(1);
  return sanitizeIdentifier(
    first.toLowerCase() +
      rest.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()).join(""),
  );
}

function toPascalCase(name: string): string {
  return sanitizeIdentifier(
    name
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
      .join(""),
  );
}

function toClientTools(tools: Tool[], publicTypeMap: Map<string, PublicToolTypes>): ClientTool[] {
  const usedByGroup = new Map<string, Set<string>>();

  return tools.map((tool) => {
    const [, rawToolName = tool.name] = tool.name.split(".", 2);
    const [rawGroupName = "default", ...rest] = rawToolName.split("/");
    const rawMethodName = rest.join("_") || rawGroupName;
    const groupName = toCamelCase(rawGroupName);
    const usedNames = usedByGroup.get(groupName) ?? new Set<string>();
    const baseMethodName = toCamelCase(rawMethodName);
    let methodName = baseMethodName;
    let suffix = 2;

    while (usedNames.has(methodName)) {
      methodName = `${baseMethodName}_${suffix}`;
      suffix += 1;
    }

    usedNames.add(methodName);
    usedByGroup.set(groupName, usedNames);

    return {
      groupName,
      inputType: publicTypeMap.get(tool.name)?.inputType ?? schemaToTypeScriptType(tool.inputs),
      interfaceName: sanitizeIdentifier(rawToolName),
      methodName,
      outputType: publicTypeMap.get(tool.name)?.outputType ?? schemaToTypeScriptType(tool.outputs),
    };
  });
}

export function renderProviderTypes(
  providerName: string,
  tools: Tool[],
  publicTypeMap: Map<string, PublicToolTypes>,
): string {
  const clientTools = toClientTools(tools, publicTypeMap);
  const namespaceName = sanitizeIdentifier(providerName);
  const providerTypeName = toPascalCase(providerName);
  const blocks = tools.map((tool) => {
    const [, rawToolName = tool.name] = tool.name.split(".", 2);
    const interfaceName = sanitizeIdentifier(rawToolName);
    const outputType = publicTypeMap.get(tool.name)?.outputType ?? schemaToTypeScriptType(tool.outputs);

    return [
      `  export interface ${interfaceName}Input {`,
      schemaToObjectContent(tool.inputs),
      "  }",
      "",
      `  export type ${interfaceName}Output = ${outputType};`,
      "",
      "  /**",
      `   * ${escapeComment(tool.description)}`,
      `   * Tags: ${escapeComment(tool.tags.join(", "))}`,
      `   * Access as: ${providerName}.${interfaceName}(args)`,
      "   */",
    ].join("\n");
  });

  const groupTypeEntries = Array.from(
    clientTools.reduce<Map<string, ClientTool[]>>((groups, tool) => {
      const group = groups.get(tool.groupName) ?? [];
      group.push(tool);
      groups.set(tool.groupName, group);
      return groups;
    }, new Map()),
  )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(
      ([groupName, groupTools]) => [
        `  ${quotePropertyName(groupName)}: {`,
        groupTools
          .sort((left, right) => left.methodName.localeCompare(right.methodName))
          .map(
            (tool) =>
              `    ${quotePropertyName(tool.methodName)}: (args: ${tool.inputType}) => Promise<${tool.outputType}>;`,
          )
          .join("\n"),
        "  };",
      ].join("\n"),
    )
    .join("\n");

  return [
    `export namespace ${namespaceName} {`,
    blocks.join("\n\n"),
    "}",
    "",
    `export type ${providerTypeName}Client = {`,
    groupTypeEntries,
    "};",
    "",
  ].join("\n");
}

export function renderProviderEntry(providerName: string): string {
  const providerTypeName = toPascalCase(providerName);

  return `import type { CreateClientOptions } from "../client.js";
import { createClient, createLazyClient } from "../client.js";
import type { ${providerTypeName}Client } from "./types.js";
import openApiDocument from "./openapi.json" with { type: "json" };

export * from "./types.js";

export function create${providerTypeName}Client(
  options: Omit<CreateClientOptions, "name" | "openApiDocument"> = {},
): Promise<${providerTypeName}Client> {
  return createClient<${providerTypeName}Client>({
    ...options,
    name: ${JSON.stringify(providerName)},
    openApiDocument,
  });
}

const defaultClient = createLazyClient(() => create${providerTypeName}Client());

export default defaultClient;
`;
}

export function renderRootClient(): string {
  return `import { HttpCallTemplateSerializer, OpenApiConverter } from "@utcp/http";
import { UtcpClient, UtcpClientConfigSerializer, type Tool } from "@utcp/sdk";

type OpenApiDocument = object;

type RuntimeMethod = {
  groupName: string;
  methodName: string;
  toolName: string;
};

export type CreateClientOptions = {
  name: string;
  openApiDocument: OpenApiDocument;
  baseUrl?: string;
  headers?: Record<string, string>;
};

function sanitizeIdentifier(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^[0-9]/, "_$&");
}

function toCamelCase(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\\s+/)
    .filter(Boolean);

  if (cleaned.length === 0) {
    return "_";
  }

  const [first = "_", ...rest] = cleaned;
  return sanitizeIdentifier(
    first.toLowerCase() +
      rest.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()).join(""),
  );
}

function getFallbackBaseUrl(openApiDocument: OpenApiDocument): string {
  const document = openApiDocument as { servers?: Array<{ url?: string }>; schemes?: string[]; host?: string; basePath?: string };
  const serverUrl = document.servers?.find((server) => typeof server.url === "string")?.url;

  if (serverUrl) {
    return serverUrl;
  }

  if (document.host) {
    const scheme = document.schemes?.[0] ?? "https";
    const basePath = document.basePath ?? "";
    return \`\${scheme}://\${document.host}\${basePath}\`;
  }

  return "https://example.com";
}

function toRuntimeMethods(tools: Tool[]): RuntimeMethod[] {
  const usedByGroup = new Map<string, Set<string>>();

  return tools.map((tool) => {
    const [, rawToolName = tool.name] = tool.name.split(".", 2);
    const [rawGroupName = "default", ...rest] = rawToolName.split("/");
    const rawMethodName = rest.join("_") || rawGroupName;
    const groupName = toCamelCase(rawGroupName);
    const baseMethodName = toCamelCase(rawMethodName);
    const usedNames = usedByGroup.get(groupName) ?? new Set<string>();
    let methodName = baseMethodName;
    let suffix = 2;

    while (usedNames.has(methodName)) {
      methodName = \`\${baseMethodName}_\${suffix}\`;
      suffix += 1;
    }

    usedNames.add(methodName);
    usedByGroup.set(groupName, usedNames);

    return {
      groupName,
      methodName,
      toolName: tool.name,
    };
  });
}

function buildClient<TClient extends object>(client: UtcpClient, tools: Tool[]): TClient {
  const value: Record<string, Record<string, unknown>> = {};

  for (const tool of toRuntimeMethods(tools)) {
    const group = value[tool.groupName] ?? {};
    group[tool.methodName] = async (args: Record<string, unknown> = {}) => client.callTool(tool.toolName, args);
    value[tool.groupName] = group;
  }

  return value as TClient;
}

export async function createClient<TClient extends object>(
  options: CreateClientOptions,
): Promise<TClient> {
  const config = new UtcpClientConfigSerializer().validateDict({
    manual_call_templates: [],
  });
  const client = await UtcpClient.create(process.cwd(), config);
  const converter = new OpenApiConverter(options.openApiDocument, {
    callTemplateName: options.name,
    baseUrl: options.baseUrl,
    headers: options.headers,
  });
  const manual = converter.convert();
  const namespacedManual = {
    ...manual,
    tools: manual.tools.map((tool) => ({
      ...tool,
      name: \`\${options.name}.\${tool.name}\`,
    })),
  };
  const manualCallTemplate = new HttpCallTemplateSerializer().validateDict({
    name: options.name,
    call_template_type: "http",
    http_method: "GET",
    url: options.baseUrl ?? getFallbackBaseUrl(options.openApiDocument),
    content_type: "application/json",
    headers: options.headers,
  });

  await client.config.tool_repository.saveManual(manualCallTemplate, namespacedManual);
  return buildClient<TClient>(client, namespacedManual.tools);
}

function getPathValue(value: unknown, path: readonly PropertyKey[]): unknown {
  return path.reduce<unknown>((current, key) => {
    if (!current || (typeof current !== "object" && typeof current !== "function")) {
      return undefined;
    }

    return Reflect.get(current, key);
  }, value);
}

export function createLazyClient<TClient extends object>(
  factory: () => Promise<TClient>,
): TClient {
  let clientPromise: Promise<TClient> | undefined;

  function loadClient(): Promise<TClient> {
    clientPromise ??= factory();
    return clientPromise;
  }

  function createProxy(path: readonly PropertyKey[]): unknown {
    return new Proxy(function lazyClientMethod() {}, {
      get(_target, property) {
        if (property === "then") {
          return undefined;
        }

        return createProxy([...path, property]);
      },
      apply(_target, _thisArg, args) {
        return loadClient().then((client) => {
          const value = getPathValue(client, path);

          if (typeof value !== "function") {
            throw new Error(\`Lazy client target \${path.map(String).join(".")} is not callable.\`);
          }

          return value(...args);
        });
      },
    });
  }

  return createProxy([]) as TClient;
}
`;
}

export function renderRootPackageEntry(): string {
  return `export { createClient, createLazyClient } from "./client.js";
export type { CreateClientOptions } from "./client.js";
`;
}

export function renderRootPackageJson(providers: RegistryProvider[]): string {
  const providerExports = Object.fromEntries(
    providers.map((provider) => [
      `./${provider.name}`,
      {
        types: `./dist/${provider.name}/index.d.ts`,
        import: `./dist/${provider.name}/index.js`,
        default: `./dist/${provider.name}/index.js`,
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
