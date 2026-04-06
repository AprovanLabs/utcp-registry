type SchemaLike = {
  additionalProperties?: boolean | SchemaLike;
  allOf?: SchemaLike[];
  anyOf?: SchemaLike[];
  description?: string;
  enum?: Array<string | number | boolean | null>;
  items?: SchemaLike | SchemaLike[];
  nullable?: boolean;
  oneOf?: SchemaLike[];
  properties?: Record<string, SchemaLike>;
  required?: string[];
  type?: string | string[];
};

export function quotePropertyName(name: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

function mapJsonTypeToTS(type: string): string {
  switch (type) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "object":
      return "{ [key: string]: unknown }";
    case "array":
      return "unknown[]";
    default:
      return "unknown";
  }
}

function withNullable(type: string, schema: SchemaLike): string {
  return schema.nullable ? `${type} | null` : type;
}

export function schemaToTypeScriptType(rawSchema: unknown): string {
  const schema = rawSchema as SchemaLike | undefined;

  if (!schema || typeof schema !== "object") {
    return "unknown";
  }

  if (schema.enum) {
    return withNullable(
      schema.enum.map((value) => (typeof value === "string" ? JSON.stringify(value) : String(value))).join(" | "),
      schema,
    );
  }

  if (Array.isArray(schema.type)) {
    return withNullable(schema.type.map(mapJsonTypeToTS).join(" | "), schema);
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length > 0) {
    return withNullable(schema.allOf.map((item) => schemaToTypeScriptType(item)).join(" & "), schema);
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length > 0) {
    return withNullable(schema.oneOf.map((item) => schemaToTypeScriptType(item)).join(" | "), schema);
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length > 0) {
    return withNullable(schema.anyOf.map((item) => schemaToTypeScriptType(item)).join(" | "), schema);
  }

  if (schema.properties && !schema.type) {
    return withNullable(schemaToTypeScriptType({ ...schema, type: "object" }), schema);
  }

  switch (schema.type) {
    case "object": {
      const properties = schema.properties ?? {};
      const required = new Set(schema.required ?? []);
      const propertyEntries = Object.entries(properties).map(([key, value]) => {
        const optionalMarker = required.has(key) ? "" : "?";
        return `${quotePropertyName(key)}${optionalMarker}: ${schemaToTypeScriptType(value)}`;
      });
      const additionalProperties =
        schema.additionalProperties && typeof schema.additionalProperties === "object"
          ? `[key: string]: ${schemaToTypeScriptType(schema.additionalProperties)} | undefined`
          : schema.additionalProperties === true
            ? "[key: string]: unknown"
            : undefined;
      const members = [...propertyEntries, ...(additionalProperties ? [additionalProperties] : [])];
      return withNullable(members.length > 0 ? `{ ${members.join("; ")} }` : "{ [key: string]: unknown }", schema);
    }
    case "array": {
      if (!schema.items) {
        return withNullable("unknown[]", schema);
      }

      const itemType = Array.isArray(schema.items)
        ? schema.items.map((item) => schemaToTypeScriptType(item as SchemaLike)).join(" | ")
        : schemaToTypeScriptType(schema.items as SchemaLike);

      return withNullable(`(${itemType})[]`, schema);
    }
    case "string":
      return withNullable("string", schema);
    case "number":
    case "integer":
      return withNullable("number", schema);
    case "boolean":
      return withNullable("boolean", schema);
    case "null":
      return "null";
    default:
      return schema.additionalProperties === true ? "{ [key: string]: unknown }" : "unknown";
  }
}

export function escapeComment(text: string): string {
  return text.replace(/\*\//g, "*\\/").replace(/\n/g, " ");
}

export function schemaToObjectContent(rawSchema: unknown): string {
  const schema = rawSchema as SchemaLike | undefined;

  if (!schema || typeof schema !== "object" || (schema.type !== "object" && !schema.properties)) {
    return "    [key: string]: unknown;";
  }

  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const lines: string[] = [];

  for (const [propName, propSchema] of Object.entries(properties)) {
    const optionalMarker = required.has(propName) ? "" : "?";
    const description = typeof propSchema.description === "string" ? propSchema.description : "";

    if (description) {
      lines.push(`    /** ${escapeComment(description)} */`);
    }

    lines.push(`    ${quotePropertyName(propName)}${optionalMarker}: ${schemaToTypeScriptType(propSchema)};`);
  }

  if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
    lines.push(`    [key: string]: ${schemaToTypeScriptType(schema.additionalProperties)} | undefined;`);
  } else if (schema.additionalProperties === true || lines.length === 0) {
    lines.push("    [key: string]: unknown;");
  }

  return lines.join("\n");
}
