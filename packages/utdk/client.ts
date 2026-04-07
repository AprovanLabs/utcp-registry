import { OpenApiConverter } from "@utcp/http";
import type { Tool } from "@utcp/sdk";

type OpenApiDocument = object;

type RuntimeMethod = {
  accessPath: string[];
  metadata: ToolRuntimeMetadata;
  toolName: string;
};

export type CreateClientOptions = {
  name: string;
  openApiDocument: OpenApiDocument;
  baseUrl?: string;
  headers?: Record<string, string>;
  toolMetadata?: ToolRuntimeMetadataMap;
};

export type ToolRuntimeMetadata = {
  accessPath: string[];
  bodyAllowsAdditionalProperties?: boolean;
  bodyKind: "none" | "properties" | "raw";
  bodyPropertyKeys: string[];
  contentType?: string;
  headerParameterKeys: string[];
  httpMethod: string;
  pathTemplate: string;
  pathConflictKeys: string[];
  pathParameterKeys: string[];
  queryConflictKeys: string[];
  queryParameterKeys: string[];
};

export type ToolRuntimeMetadataMap = Record<string, ToolRuntimeMetadata>;

export type ToolTransportOverrides = {
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

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

function toCamelCase(name: string): string {
  const cleaned = splitIdentifierWords(name);

  if (cleaned.length === 0) {
    return "_";
  }

  const [first = "_", ...rest] = cleaned;
  return sanitizeIdentifier(
    first.toLowerCase() +
      rest.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()).join(""),
  );
}

function splitRawToolName(toolName: string): string[] {
  return toolName.split("/").filter(Boolean);
}

function hasPathConflict(candidate: string[], usedPaths: Set<string>): boolean {
  const key = candidate.join(".");

  for (const usedPath of usedPaths) {
    if (usedPath === key || usedPath.startsWith(`${key}.`) || key.startsWith(`${usedPath}.`)) {
      return true;
    }
  }

  return false;
}

function createUniqueAccessPath(rawToolName: string, usedPaths: Set<string>): string[] {
  const rawSegments = splitRawToolName(rawToolName);
  const basePath = (rawSegments.length > 0 ? rawSegments : [rawToolName]).map(toCamelCase);

  if (basePath.length > 1 && basePath.at(-1) === basePath.at(-2)) {
    basePath[basePath.length - 1] = "call";
  }

  const baseLeaf = basePath[basePath.length - 1] ?? "_";
  let accessPath = [...basePath];
  let suffix = 2;

  while (hasPathConflict(accessPath, usedPaths)) {
    accessPath = [...basePath.slice(0, -1), `${baseLeaf}_${suffix}`];
    suffix += 1;
  }

  usedPaths.add(accessPath.join("."));
  return accessPath;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasOwn(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function createFallbackMetadata(rawToolName: string, tool: Tool, usedPaths: Set<string>): ToolRuntimeMetadata {
  return {
    accessPath: createUniqueAccessPath(rawToolName, usedPaths),
    bodyKind: "none",
    bodyPropertyKeys: [],
    contentType:
      tool.tool_call_template && typeof tool.tool_call_template.content_type === "string"
        ? tool.tool_call_template.content_type
        : undefined,
    headerParameterKeys: [],
    httpMethod:
      tool.tool_call_template && typeof tool.tool_call_template.http_method === "string"
        ? tool.tool_call_template.http_method
        : "GET",
    pathTemplate:
      tool.tool_call_template && typeof tool.tool_call_template.url === "string"
        ? tool.tool_call_template.url.replace(/^https?:\/\/[^/]+/u, "")
        : "/",
    pathConflictKeys: [],
    pathParameterKeys: [],
    queryConflictKeys: [],
    queryParameterKeys: [],
  };
}

function applyTransportValues(
  target: Record<string, unknown>,
  input: Record<string, unknown>,
  overrides: Record<string, unknown>,
  keys: string[],
  conflictKeys: Set<string>,
  allowConflictingInput: boolean,
  consumedKeys: Set<string>,
): void {
  for (const key of keys) {
    if (hasOwn(overrides, key)) {
      target[key] = overrides[key];
      continue;
    }

    if (conflictKeys.has(key) && !allowConflictingInput) {
      continue;
    }

    if (hasOwn(input, key)) {
      target[key] = input[key];
      consumedKeys.add(key);
    }
  }
}

export type AssembledRequest = {
  body?: unknown;
  headers: Record<string, unknown>;
  pathParams: Record<string, unknown>;
  queryParams: Record<string, unknown>;
};

export function assembleRequest(
  metadata: ToolRuntimeMetadata,
  input: Record<string, unknown> = {},
  overrides: ToolTransportOverrides = {},
): AssembledRequest {
  const sourceInput = isRecord(input) ? input : {};
  const paramsOverrides = isRecord(overrides.params) ? overrides.params : {};
  const queryOverrides = isRecord(overrides.query) ? overrides.query : {};
  const headerOverrides = isRecord(overrides.headers) ? overrides.headers : {};
  const consumedKeys = new Set<string>();
  const pathParams: Record<string, unknown> = {};
  const queryParams: Record<string, unknown> = {};
  const headers: Record<string, unknown> = {};
  const hasExplicitBodyWrapper = hasOwn(sourceInput, "body");
  const transportConflictKeys = new Set([...metadata.pathConflictKeys, ...metadata.queryConflictKeys]);
  let structuredBody = metadata.bodyKind === "properties" ? (isRecord(sourceInput.body) ? { ...sourceInput.body } : {}) : undefined;
  let body: unknown;

  if (metadata.bodyKind === "properties") {
    for (const key of metadata.bodyPropertyKeys) {
      if (hasOwn(sourceInput, key) && (!hasExplicitBodyWrapper || !transportConflictKeys.has(key))) {
        structuredBody ??= {};
        structuredBody[key] = sourceInput[key];
        consumedKeys.add(key);
      }
    }

    if (hasExplicitBodyWrapper) {
      consumedKeys.add("body");
    }

  } else if (metadata.bodyKind === "raw" && hasExplicitBodyWrapper) {
    body = sourceInput.body;
    consumedKeys.add("body");
  }

  applyTransportValues(
    pathParams,
    sourceInput,
    paramsOverrides,
    metadata.pathParameterKeys,
    new Set(metadata.pathConflictKeys),
    hasExplicitBodyWrapper,
    consumedKeys,
  );
  applyTransportValues(
    queryParams,
    sourceInput,
    queryOverrides,
    metadata.queryParameterKeys,
    new Set(metadata.queryConflictKeys),
    hasExplicitBodyWrapper,
    consumedKeys,
  );
  applyTransportValues(headers, sourceInput, headerOverrides, metadata.headerParameterKeys, new Set(), false, consumedKeys);

  for (const [key, value] of Object.entries(sourceInput)) {
    if (!consumedKeys.has(key)) {
      if (metadata.bodyKind === "properties" && metadata.bodyAllowsAdditionalProperties) {
        structuredBody ??= {};
        structuredBody[key] = value;
        continue;
      }

      queryParams[key] = value;
    }
  }

  if (metadata.bodyKind === "properties" && structuredBody && Object.keys(structuredBody).length > 0) {
    body = structuredBody;
  }

  return {
    ...(body !== undefined ? { body } : {}),
    headers,
    pathParams,
    queryParams,
  };
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

function methodAcceptsInput(metadata: ToolRuntimeMetadata): boolean {
  return metadata.bodyKind !== "none" || metadata.pathParameterKeys.length > 0 || metadata.queryParameterKeys.length > 0;
}

function buildUrl(baseUrl: string, pathTemplate: string, pathParams: Record<string, unknown>, queryParams: Record<string, unknown>): string {
  let pathname = pathTemplate;

  for (const match of pathTemplate.match(/\{([^}]+)\}/g) ?? []) {
    const key = match.slice(1, -1);

    if (!(key in pathParams)) {
      throw new Error(`Missing required path parameter: ${key}`);
    }

    pathname = pathname.replace(match, encodeURIComponent(String(pathParams[key])));
  }

  const url = new URL(pathname, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }

      continue;
    }

    url.searchParams.append(key, String(value));
  }

  return url.toString();
}

function toBodyInit(body: unknown, contentType: string | undefined): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof ArrayBuffer ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ReadableStream
  ) {
    return body;
  }

  if (contentType?.includes("json") || contentType?.includes("+json") || typeof body === "object") {
    return JSON.stringify(body);
  }

  return String(body);
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("json")) {
    return response.json();
  }

  if (contentType.startsWith("text/") || contentType.includes("xml") || contentType.includes("yaml")) {
    return response.text();
  }

  const text = await response.text();
  return text ? text : undefined;
}

async function executeRequest(
  metadata: ToolRuntimeMetadata,
  options: CreateClientOptions,
  input: Record<string, unknown>,
  overrides?: ToolTransportOverrides,
): Promise<unknown> {
  const request = assembleRequest(metadata, input, overrides);
  const baseUrl = options.baseUrl ?? getFallbackBaseUrl(options.openApiDocument);
  const requestHeaders = {
    ...(options.headers ?? {}),
    ...Object.fromEntries(Object.entries(request.headers).map(([key, value]) => [key, String(value)])),
  };
  const body = toBodyInit(request.body, metadata.contentType);

  if (body !== undefined && metadata.contentType && !Object.keys(requestHeaders).some((key) => key.toLowerCase() === "content-type")) {
    requestHeaders["Content-Type"] = metadata.contentType;
  }

  const response = await fetch(
    buildUrl(baseUrl, metadata.pathTemplate, request.pathParams, request.queryParams),
    {
      body,
      headers: requestHeaders,
      method: metadata.httpMethod,
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}${errorBody ? `\n${errorBody}` : ""}`,
    );
  }

  return parseResponse(response);
}

function toRuntimeMethods(tools: Tool[], toolMetadata: ToolRuntimeMetadataMap): RuntimeMethod[] {
  const usedPaths = new Set<string>();

  return tools.map((tool) => {
    const [, rawToolName = tool.name] = tool.name.split(".", 2);
    const metadata = toolMetadata[tool.name] ?? createFallbackMetadata(rawToolName, tool, usedPaths);

    usedPaths.add(metadata.accessPath.join("."));

    return {
      accessPath: metadata.accessPath,
      metadata,
      toolName: tool.name,
    };
  });
}

function buildClient<TClient extends object>(tools: Tool[], toolMetadata: ToolRuntimeMetadataMap, options: CreateClientOptions): TClient {
  const value: Record<string, unknown> = {};

  function setPath(target: Record<string, unknown>, path: string[], entry: unknown): void {
    const [segment, ...rest] = path;

    if (!segment) {
      return;
    }

    if (rest.length === 0) {
      target[segment] = entry;
      return;
    }

    const next = target[segment];
    const child =
      next && typeof next === "object" && !Array.isArray(next) ? (next as Record<string, unknown>) : {};

    target[segment] = child;
    setPath(child, rest, entry);
  }

  for (const method of toRuntimeMethods(tools, toolMetadata)) {
    const acceptsInput = methodAcceptsInput(method.metadata);

    setPath(
      value,
      method.accessPath,
      async (firstArg?: Record<string, unknown>, secondArg?: ToolTransportOverrides) =>
        executeRequest(
          method.metadata,
          options,
          acceptsInput && isRecord(firstArg) ? firstArg : {},
          acceptsInput
            ? secondArg
            : isRecord(secondArg)
              ? secondArg
              : isRecord(firstArg)
                ? (firstArg as ToolTransportOverrides)
                : undefined,
        ),
    );
  }

  return value as TClient;
}

export async function createClient<TClient extends object>(
  options: CreateClientOptions,
): Promise<TClient> {
  const converter = new OpenApiConverter(options.openApiDocument, {
    callTemplateName: options.name,
    baseUrl: options.baseUrl,
    headers: options.headers,
  });
  const manual = converter.convert();
  return buildClient<TClient>(manual.tools, options.toolMetadata ?? {}, options);
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
