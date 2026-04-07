import type { Tool } from "@utcp/sdk";
import type { OpenAPIV3 } from "openapi-types";

import { getDocumentPathItem } from "./openapi-path.js";
import { stripProviderToolName, type RegistryProvider } from "./provider.js";
import { schemaToTypeScriptType } from "./schema.js";

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

export type ClientToolDefinition = {
  accessPath: string[];
  hasInput: boolean;
  hasOptions: boolean;
  inputType: string;
  optionsOptional: boolean;
  optionsType: string;
  runtimeMetadata: ToolRuntimeMetadata;
};

type ParameterLocation = "cookie" | "header" | "path" | "query";

type ParameterDefinition = {
  location: ParameterLocation;
  name: string;
  required: boolean;
  schema: OpenAPIV3.SchemaObject;
};

type RequestDefinition = {
  bodyRequired: boolean;
  bodySchema?: OpenAPIV3.SchemaObject;
  parameters: ParameterDefinition[];
};

type AdditionalProperties = OpenAPIV3.SchemaObject["additionalProperties"];

function isReferenceObject(value: unknown): value is OpenAPIV3.ReferenceObject {
  return Boolean(value && typeof value === "object" && "$ref" in value);
}

function getRefTarget(document: OpenAPIV3.Document, ref: string): unknown {
  if (!ref.startsWith("#/")) {
    return undefined;
  }

  return ref
    .slice(2)
    .split("/")
    .reduce<unknown>((current, part) => {
      if (!current || typeof current !== "object") {
        return undefined;
      }

      return (current as Record<string, unknown>)[part.replace(/~1/g, "/").replace(/~0/g, "~")];
    }, document);
}

function resolveSchema(
  document: OpenAPIV3.Document,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined,
  seen: Set<string> = new Set(),
): OpenAPIV3.SchemaObject | undefined {
  if (!schema) {
    return undefined;
  }

  if (isReferenceObject(schema)) {
    if (seen.has(schema.$ref)) {
      return { type: "object", additionalProperties: true };
    }

    const target = getRefTarget(document, schema.$ref);

    if (!target || typeof target !== "object") {
      return undefined;
    }

    const nextSeen = new Set(seen);
    nextSeen.add(schema.$ref);
    return resolveSchema(document, target as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject, nextSeen);
  }

  const resolved: OpenAPIV3.SchemaObject = { ...schema };

  if (schema.properties) {
    resolved.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, value]) => [key, resolveSchema(document, value, seen) ?? { type: "object" }]),
    );
  }

  const arraySchema = schema as OpenAPIV3.ArraySchemaObject;

  if (arraySchema.items) {
    (resolved as OpenAPIV3.ArraySchemaObject).items = (Array.isArray(arraySchema.items)
      ? arraySchema.items.map((item) => resolveSchema(document, item, seen) ?? { type: "object" })
      : (resolveSchema(document, arraySchema.items, seen) ?? { type: "object" })) as OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
  }

  if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
    resolved.additionalProperties = resolveSchema(document, schema.additionalProperties, seen);
  }

  if (schema.allOf) {
    resolved.allOf = schema.allOf
      .map((item) => resolveSchema(document, item, seen))
      .filter((item): item is OpenAPIV3.SchemaObject => Boolean(item));
  }

  if (schema.anyOf) {
    resolved.anyOf = schema.anyOf
      .map((item) => resolveSchema(document, item, seen))
      .filter((item): item is OpenAPIV3.SchemaObject => Boolean(item));
  }

  if (schema.oneOf) {
    resolved.oneOf = schema.oneOf
      .map((item) => resolveSchema(document, item, seen))
      .filter((item): item is OpenAPIV3.SchemaObject => Boolean(item));
  }

  return resolved;
}

function getOperationContext(
  document: OpenAPIV3.Document,
  tool: Tool,
): { operation?: OpenAPIV3.OperationObject; pathItem?: OpenAPIV3.PathItemObject } {
  const method =
    tool.tool_call_template && typeof tool.tool_call_template.http_method === "string"
      ? tool.tool_call_template.http_method.toLowerCase()
      : undefined;
  const rawUrl =
    tool.tool_call_template && typeof tool.tool_call_template.url === "string" ? tool.tool_call_template.url : undefined;

  if (!method || !rawUrl) {
    return {};
  }

  const { pathItem } = getDocumentPathItem(document, rawUrl);

  if (!pathItem || !(method in pathItem)) {
    return {};
  }

  return {
    operation: pathItem[method as keyof OpenAPIV3.PathItemObject] as OpenAPIV3.OperationObject | undefined,
    pathItem,
  };
}

function getPreferredContentSchema(
  document: OpenAPIV3.Document,
  content: Record<string, OpenAPIV3.MediaTypeObject> | undefined,
): OpenAPIV3.SchemaObject | undefined {
  if (!content) {
    return undefined;
  }

  const contentEntry =
    content["application/json"] ??
    Object.entries(content).find(([contentType]) => contentType.includes("json"))?.[1] ??
    Object.values(content)[0];

  return resolveSchema(document, contentEntry?.schema);
}

function resolveParameter(
  document: OpenAPIV3.Document,
  parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
): OpenAPIV3.ParameterObject | undefined {
  if (isReferenceObject(parameter)) {
    const target = getRefTarget(document, parameter.$ref);
    return target && typeof target === "object" ? (target as OpenAPIV3.ParameterObject) : undefined;
  }

  return parameter;
}

function resolveRequestBody(
  document: OpenAPIV3.Document,
  requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject | undefined,
): OpenAPIV3.RequestBodyObject | undefined {
  if (!requestBody) {
    return undefined;
  }

  if (isReferenceObject(requestBody)) {
    const target = getRefTarget(document, requestBody.$ref);
    return target && typeof target === "object" ? (target as OpenAPIV3.RequestBodyObject) : undefined;
  }

  return requestBody;
}

function toObjectSchema(
  properties: Record<string, OpenAPIV3.SchemaObject>,
  required: string[] = [],
  additionalProperties?: AdditionalProperties,
): OpenAPIV3.SchemaObject {
  return {
    type: "object",
    ...(Object.keys(properties).length > 0 ? { properties } : {}),
    ...(required.length > 0 ? { required } : {}),
    ...(additionalProperties !== undefined ? { additionalProperties } : {}),
  };
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

function toCamelCase(name: string): string {
  const cleaned = splitIdentifierWords(name);

  if (cleaned.length === 0) {
    return "_";
  }

  const [first = "_", ...rest] = cleaned;
  return sanitizeIdentifier(
    first.toLowerCase() + rest.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()).join(""),
  );
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
  const normalizedSegments = rawToolName
    .split("/")
    .filter(Boolean)
    .map(toCamelCase);
  const basePath = normalizedSegments.length > 0 ? normalizedSegments : [toCamelCase(rawToolName)];

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

function buildRequestDefinition(document: OpenAPIV3.Document, tool: Tool): RequestDefinition {
  const { operation, pathItem } = getOperationContext(document, tool);
  const parameterMap = new Map<string, ParameterDefinition>();
  const parameterValues = [...(pathItem?.parameters ?? []), ...(operation?.parameters ?? [])];

  for (const parameterValue of parameterValues) {
    const parameter = resolveParameter(document, parameterValue);

    if (!parameter || !["cookie", "header", "path", "query"].includes(parameter.in)) {
      continue;
    }

    const schema = resolveSchema(
      document,
      parameter.schema ?? getPreferredContentSchema(document, parameter.content),
    );

    if (!schema) {
      continue;
    }

    parameterMap.set(`${parameter.in}:${parameter.name}`, {
      location: parameter.in as ParameterLocation,
      name: parameter.name,
      required: parameter.in === "path" ? true : Boolean(parameter.required),
      schema,
    });
  }

  const requestBody = resolveRequestBody(document, operation?.requestBody);
  const bodySchema = getPreferredContentSchema(document, requestBody?.content);

  return {
    bodyRequired: Boolean(requestBody?.required),
    bodySchema,
    parameters: [...parameterMap.values()],
  };
}

function flattenObjectSchema(
  schema: OpenAPIV3.SchemaObject | undefined,
): {
  additionalProperties?: AdditionalProperties;
  properties: Record<string, OpenAPIV3.SchemaObject>;
  required: string[];
} | undefined {
  if (!schema || typeof schema !== "object") {
    return undefined;
  }

  const isObjectLike = schema.type === "object" || Boolean(schema.properties) || Boolean(schema.allOf);

  if (!isObjectLike) {
    return undefined;
  }

  if (schema.anyOf || schema.oneOf) {
    return undefined;
  }

  const properties: Record<string, OpenAPIV3.SchemaObject> = {};
  const required = new Set<string>(Array.isArray(schema.required) ? schema.required : []);
  let additionalProperties = schema.additionalProperties;

  if (schema.properties) {
    Object.assign(
      properties,
      Object.fromEntries(
        Object.entries(schema.properties).map(([key, value]) => [key, value as OpenAPIV3.SchemaObject]),
      ),
    );
  }

  for (const item of schema.allOf ?? []) {
    const flattenedItem = flattenObjectSchema(item as OpenAPIV3.SchemaObject);

    if (!flattenedItem) {
      return undefined;
    }

    Object.assign(properties, flattenedItem.properties);

    for (const key of flattenedItem.required) {
      required.add(key);
    }

    if (flattenedItem.additionalProperties !== undefined) {
      if (additionalProperties !== undefined) {
        return undefined;
      }

      additionalProperties = flattenedItem.additionalProperties;
    }
  }

  return Object.keys(properties).length > 0
    ? {
        ...(additionalProperties !== undefined ? { additionalProperties } : {}),
        properties,
        required: [...required],
      }
    : undefined;
}

function buildInputSchema(request: RequestDefinition): {
  hasInput: boolean;
  schema: OpenAPIV3.SchemaObject;
  runtimeMetadata: ToolRuntimeMetadata;
} {
  const flattenedBodySchema = flattenObjectSchema(request.bodySchema);
  const bodyPropertySchemas = flattenedBodySchema?.properties;
  const bodyAdditionalProperties = flattenedBodySchema?.additionalProperties;
  const bodyPropertyKeys = bodyPropertySchemas ? Object.keys(bodyPropertySchemas) : [];
  const pathParameters = request.parameters.filter((parameter) => parameter.location === "path");
  const queryParameters = request.parameters.filter((parameter) => parameter.location === "query");
  const headerParameters = request.parameters.filter((parameter) => parameter.location === "header");
  const passthroughParameters = request.parameters.filter(
    (parameter) => parameter.location !== "path" && parameter.location !== "query" && parameter.location !== "header",
  );
  const bodyPropertyKeySet = new Set(bodyPropertyKeys);
  const pathConflictKeys = pathParameters
    .filter((parameter) => bodyPropertyKeySet.has(parameter.name))
    .map((parameter) => parameter.name);
  const queryConflictKeys = queryParameters
    .filter((parameter) => bodyPropertyKeySet.has(parameter.name))
    .map((parameter) => parameter.name);
  const hiddenTransportKeys = new Set([...pathConflictKeys, ...queryConflictKeys]);
  const properties: Record<string, OpenAPIV3.SchemaObject> = {};
  const required = new Set<string>();

  if (bodyPropertySchemas) {
    Object.assign(properties, bodyPropertySchemas);

    for (const key of flattenedBodySchema?.required ?? []) {
      required.add(key);
    }
  } else if (request.bodySchema) {
    properties.body = request.bodySchema;

    if (request.bodyRequired) {
      required.add("body");
    }
  }

  for (const parameter of [...pathParameters, ...queryParameters, ...passthroughParameters]) {
    if (hiddenTransportKeys.has(parameter.name)) {
      continue;
    }

    properties[parameter.name] = parameter.schema;

    if (parameter.required) {
      required.add(parameter.name);
    }
  }

  return {
    hasInput: Object.keys(properties).length > 0,
    schema: toObjectSchema(properties, [...required], bodyPropertySchemas ? bodyAdditionalProperties : undefined),
    runtimeMetadata: {
      accessPath: [],
      bodyAllowsAdditionalProperties: Boolean(bodyPropertySchemas && bodyAdditionalProperties),
      bodyKind: bodyPropertySchemas ? "properties" : request.bodySchema ? "raw" : "none",
      bodyPropertyKeys,
      contentType: undefined,
      headerParameterKeys: headerParameters.map((parameter) => parameter.name),
      httpMethod: "GET",
      pathTemplate: "/",
      pathConflictKeys,
      pathParameterKeys: pathParameters.map((parameter) => parameter.name),
      queryConflictKeys,
      queryParameterKeys: queryParameters.map((parameter) => parameter.name),
    },
  };
}

function buildOptionsSchema(request: RequestDefinition, runtimeMetadata: ToolRuntimeMetadata): {
  hasOptions: boolean;
  optional: boolean;
  schema: OpenAPIV3.SchemaObject;
} {
  const pathParameterMap = new Map(request.parameters.filter((parameter) => parameter.location === "path").map((parameter) => [parameter.name, parameter]));
  const queryParameterMap = new Map(request.parameters.filter((parameter) => parameter.location === "query").map((parameter) => [parameter.name, parameter]));
  const headerParameterMap = new Map(request.parameters.filter((parameter) => parameter.location === "header").map((parameter) => [parameter.name, parameter]));
  const properties: Record<string, OpenAPIV3.SchemaObject> = {};
  const required: string[] = [];

  if (runtimeMetadata.pathConflictKeys.length > 0) {
    const paramsRequired = runtimeMetadata.pathConflictKeys.filter((key) => pathParameterMap.get(key)?.required);
    properties.params = toObjectSchema(
      Object.fromEntries(runtimeMetadata.pathConflictKeys.map((key) => [key, pathParameterMap.get(key)?.schema ?? { type: "object" }])),
      paramsRequired,
    );

    if (paramsRequired.length > 0) {
      required.push("params");
    }
  }

  if (runtimeMetadata.queryConflictKeys.length > 0) {
    const queryRequired = runtimeMetadata.queryConflictKeys.filter((key) => queryParameterMap.get(key)?.required);
    properties.query = toObjectSchema(
      Object.fromEntries(runtimeMetadata.queryConflictKeys.map((key) => [key, queryParameterMap.get(key)?.schema ?? { type: "object" }])),
      queryRequired,
    );

    if (queryRequired.length > 0) {
      required.push("query");
    }
  }

  if (headerParameterMap.size > 0) {
    const headerRequired = [...headerParameterMap.values()].filter((parameter) => parameter.required).map((parameter) => parameter.name);
    properties.headers = toObjectSchema(
      Object.fromEntries([...headerParameterMap.entries()].map(([key, parameter]) => [key, parameter.schema])),
      headerRequired,
    );

    if (headerRequired.length > 0) {
      required.push("headers");
    }
  }

  return {
    hasOptions: Object.keys(properties).length > 0,
    optional: required.length === 0,
    schema: toObjectSchema(properties, required),
  };
}

export function buildClientToolMap(
  document: OpenAPIV3.Document,
  tools: Tool[],
  provider: Pick<RegistryProvider, "name" | "options">,
): Map<string, ClientToolDefinition> {
  const usedPaths = new Set<string>();

  return new Map(
    tools.map((tool) => {
      const rawToolName = stripProviderToolName(tool.name, provider);
      const request = buildRequestDefinition(document, tool);
      const { hasInput, schema: inputSchema, runtimeMetadata } = buildInputSchema(request);
      const { schema: optionsSchema, optional: optionsOptional, hasOptions } = buildOptionsSchema(request, runtimeMetadata);
      const accessPath = createUniqueAccessPath(rawToolName, usedPaths);

      return [
        tool.name,
        {
          accessPath,
          hasInput,
          hasOptions,
          inputType: schemaToTypeScriptType(inputSchema),
          optionsOptional,
          optionsType: schemaToTypeScriptType(optionsSchema),
          runtimeMetadata: {
            ...runtimeMetadata,
            accessPath,
            contentType:
              tool.tool_call_template && typeof tool.tool_call_template.content_type === "string"
                ? tool.tool_call_template.content_type
                : undefined,
            httpMethod:
              tool.tool_call_template && typeof tool.tool_call_template.http_method === "string"
                ? tool.tool_call_template.http_method
                : "GET",
            pathTemplate:
              tool.tool_call_template && typeof tool.tool_call_template.url === "string"
                ? tool.tool_call_template.url.replace(/^https?:\/\/[^/]+/u, "")
                : "/",
          },
        },
      ];
    }),
  );
}
