import type { Tool } from "@utcp/sdk";
import type { OpenAPIV3 } from "openapi-types";

import type { RegistryProvider } from "./provider.js";
import { schemaToTypeScriptType } from "./schema.js";

type PublicToolTypes = {
  inputType: string;
  outputType: string;
};

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
    (resolved as any).items = Array.isArray(arraySchema.items)
      ? arraySchema.items.map((item: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject) => resolveSchema(document, item, seen) ?? { type: "object" })
      : (resolveSchema(document, arraySchema.items, seen) ?? { type: "object" });
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

function getOperation(
  document: OpenAPIV3.Document,
  tool: Tool,
): OpenAPIV3.OperationObject | undefined {
  const method =
    tool.tool_call_template && typeof tool.tool_call_template.http_method === "string"
      ? tool.tool_call_template.http_method.toLowerCase()
      : undefined;
  const rawUrl =
    tool.tool_call_template && typeof tool.tool_call_template.url === "string" ? tool.tool_call_template.url : undefined;

  if (!method || !rawUrl) {
    return undefined;
  }

  const pathname = rawUrl.replace(/^https?:\/\/[^/]+/u, "");
  const pathItem = document.paths?.[pathname];

  if (!pathItem || !(method in pathItem)) {
    return undefined;
  }

  return pathItem[method as keyof OpenAPIV3.PathItemObject] as OpenAPIV3.OperationObject | undefined;
}

function getResponseSchema(
  document: OpenAPIV3.Document,
  operation: OpenAPIV3.OperationObject | undefined,
): OpenAPIV3.SchemaObject | undefined {
  if (!operation) {
    return undefined;
  }

  const responseEntries = Object.entries(operation.responses ?? {}).sort(([left], [right]) => {
    const leftScore = /^2\d\d$/.test(left) ? 0 : left === "default" ? 2 : 1;
    const rightScore = /^2\d\d$/.test(right) ? 0 : right === "default" ? 2 : 1;
    return leftScore - rightScore;
  });

  for (const [, responseValue] of responseEntries) {
    const response = isReferenceObject(responseValue)
      ? (getRefTarget(document, responseValue.$ref) as OpenAPIV3.ResponseObject | undefined)
      : responseValue;

    if (!response?.content) {
      continue;
    }

    const contentEntry =
      response.content["application/json"] ??
      Object.entries(response.content).find(([contentType]) => contentType.includes("json"))?.[1] ??
      Object.values(response.content)[0];

    const schema = resolveSchema(document, contentEntry?.schema);

    if (schema) {
      return schema;
    }
  }

  return undefined;
}

export async function loadOpenApiDocument(provider: RegistryProvider): Promise<OpenAPIV3.Document> {
  const response = await fetch(provider.url, {
    headers: {
      Accept: provider.content_type ?? "application/json",
      "User-Agent": "Stitchery/1.0.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${provider.name} OpenAPI schema: ${response.status} ${response.statusText}`);
  }

  return JSON.parse(await response.text()) as OpenAPIV3.Document;
}

export function buildPublicTypeMap(document: OpenAPIV3.Document, tools: Tool[]): Map<string, PublicToolTypes> {
  return new Map(
    tools.map((tool) => {
      const operation = getOperation(document, tool);
      const responseSchema = getResponseSchema(document, operation);

      return [
        tool.name,
        {
          inputType: schemaToTypeScriptType(tool.inputs),
          outputType: responseSchema ? schemaToTypeScriptType(responseSchema) : schemaToTypeScriptType(tool.outputs),
        },
      ];
    }),
  );
}
