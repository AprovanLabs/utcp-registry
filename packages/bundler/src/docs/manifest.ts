import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  DOCS_MANIFEST_SCHEMA_VERSION,
  DocsManifest,
  DocsPipelineError,
} from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
}

function toReferences(value: unknown): DocsManifest["references"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is Record<string, unknown> => isRecord(entry) && typeof entry.url === "string")
    .map((entry) => ({
      source:
        entry.source === "registry-seed" || entry.source === "package-metadata" || entry.source === "openapi"
          ? entry.source
          : "registry-seed",
      url: entry.url as string,
      canonicalUrl: toOptionalString(entry.canonicalUrl),
      label: toOptionalString(entry.label),
      category:
        entry.category === "overview" ||
        entry.category === "reference" ||
        entry.category === "guide" ||
        entry.category === "changelog" ||
        entry.category === "other"
          ? entry.category
          : undefined,
      notes: toOptionalString(entry.notes),
    }));
}

function toSources(value: unknown): DocsManifest["sources"] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (entry): entry is Record<string, unknown> =>
        isRecord(entry) &&
        typeof entry.sourceUrl === "string" &&
        typeof entry.canonicalUrl === "string" &&
        typeof entry.filePath === "string" &&
        typeof entry.sha256 === "string",
    )
    .map((entry) => ({
      sourceUrl: entry.sourceUrl as string,
      canonicalUrl: entry.canonicalUrl as string,
      category:
        entry.category === "overview" ||
        entry.category === "reference" ||
        entry.category === "guide" ||
        entry.category === "changelog" ||
        entry.category === "other"
          ? entry.category
          : "other",
      title: toOptionalString(entry.title),
      contentType: toOptionalString(entry.contentType),
      filePath: entry.filePath as string,
      sha256: entry.sha256 as string,
      fetchedAt: toOptionalString(entry.fetchedAt) ?? new Date(0).toISOString(),
    }));
}

export function assertSupportedDocsManifestVersion(schemaVersion: number): void {
  if (schemaVersion !== DOCS_MANIFEST_SCHEMA_VERSION) {
    throw new DocsPipelineError(
      "DOCS_MANIFEST_UNSUPPORTED_VERSION",
      `Unsupported docs manifest schema version ${schemaVersion}. Expected ${DOCS_MANIFEST_SCHEMA_VERSION}.`,
      { schemaVersion, expectedSchemaVersion: DOCS_MANIFEST_SCHEMA_VERSION },
    );
  }
}

export function createDocsManifest(
  provider: string,
  partial: Partial<Omit<DocsManifest, "provider" | "schemaVersion">> = {},
): DocsManifest {
  return {
    schemaVersion: DOCS_MANIFEST_SCHEMA_VERSION,
    provider,
    generatedAt: partial.generatedAt ?? new Date().toISOString(),
    openApi: {
      url: partial.openApi?.url,
      hash: partial.openApi?.hash ?? null,
    },
    references: partial.references ?? [],
    sources: partial.sources ?? [],
    warnings: partial.warnings ?? [],
  };
}

export async function readDocsManifest(manifestPath: string): Promise<DocsManifest | undefined> {
  try {
    const raw = await readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!isRecord(parsed)) {
      throw new DocsPipelineError("DOCS_MANIFEST_INVALID", `Docs manifest at ${manifestPath} is not an object.`);
    }

    const schemaVersion =
      typeof parsed.schemaVersion === "number"
        ? parsed.schemaVersion
        : typeof parsed.schema_version === "number"
          ? parsed.schema_version
          : DOCS_MANIFEST_SCHEMA_VERSION;

    assertSupportedDocsManifestVersion(schemaVersion);

    const provider = toOptionalString(parsed.provider) ?? "unknown";
    const openApiRecord = isRecord(parsed.openApi) ? parsed.openApi : {};

    return {
      schemaVersion,
      provider,
      generatedAt: toOptionalString(parsed.generatedAt) ?? new Date(0).toISOString(),
      openApi: {
        url: toOptionalString(openApiRecord.url),
        hash: toOptionalString(openApiRecord.hash) ?? null,
      },
      references: toReferences(parsed.references),
      sources: toSources(parsed.sources),
      warnings: toStringArray(parsed.warnings),
    };
  } catch (error: unknown) {
    if (typeof error === "object" && error && "code" in error && error.code === "ENOENT") {
      return undefined;
    }

    if (error instanceof DocsPipelineError) {
      throw error;
    }

    throw new DocsPipelineError("DOCS_MANIFEST_INVALID", `Failed to read docs manifest at ${manifestPath}.`, {
      cause: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function readDocsManifestOrDefault(manifestPath: string, provider: string): Promise<DocsManifest> {
  return (await readDocsManifest(manifestPath)) ?? createDocsManifest(provider);
}

export async function writeDocsManifest(manifestPath: string, manifest: DocsManifest): Promise<void> {
  assertSupportedDocsManifestVersion(manifest.schemaVersion);
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2).concat("\n"), "utf8");
}
