import { HttpCallTemplateSerializer, OpenApiConverter } from "@utcp/http";
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
    .split(/\s+/)
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
    return `${scheme}://${document.host}${basePath}`;
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
      methodName = `${baseMethodName}_${suffix}`;
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
      name: `${options.name}.${tool.name}`,
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
            throw new Error(`Lazy client target ${path.map(String).join(".")} is not callable.`);
          }

          return value(...args);
        });
      },
    });
  }

  return createProxy([]) as TClient;
}
