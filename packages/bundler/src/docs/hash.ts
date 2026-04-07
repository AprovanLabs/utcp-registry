import { createHash } from "node:crypto";

import { DOCS_MANIFEST_SCHEMA_VERSION } from "./types.js";

export type DocsStaleReason =
  | "up-to-date"
  | "manifest-version-changed"
  | "openapi-hash-missing"
  | "openapi-changed"
  | "prompt-hash-missing"
  | "prompt-changed";

export type DocsStaleCheckInput = {
  previousManifestVersion?: number | null;
  expectedManifestVersion?: number;
  previousOpenApiHash?: string | null;
  nextOpenApiHash?: string | null;
  previousPromptHash?: string | null;
  nextPromptHash?: string | null;
};

export type DocsStaleCheckResult = {
  isStale: boolean;
  reason: DocsStaleReason;
};

function normalizeForStableStringify(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeForStableStringify(entry));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, normalizeForStableStringify(nested)]),
  );
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(normalizeForStableStringify(value));
}

export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function hashOpenApiDocument(document: unknown): string {
  return hashContent(stableStringify(document));
}

export function getDocsStaleCheckResult(input: DocsStaleCheckInput): DocsStaleCheckResult {
  const expectedManifestVersion = input.expectedManifestVersion ?? DOCS_MANIFEST_SCHEMA_VERSION;

  if (
    typeof input.previousManifestVersion === "number" &&
    input.previousManifestVersion !== expectedManifestVersion
  ) {
    return { isStale: true, reason: "manifest-version-changed" };
  }

  if (input.previousOpenApiHash == null && input.nextOpenApiHash != null) {
    return { isStale: true, reason: "openapi-hash-missing" };
  }

  if (
    input.previousOpenApiHash != null &&
    input.nextOpenApiHash != null &&
    input.previousOpenApiHash !== input.nextOpenApiHash
  ) {
    return { isStale: true, reason: "openapi-changed" };
  }

  if (input.previousPromptHash == null && input.nextPromptHash != null) {
    return { isStale: true, reason: "prompt-hash-missing" };
  }

  if (
    input.previousPromptHash != null &&
    input.nextPromptHash != null &&
    input.previousPromptHash !== input.nextPromptHash
  ) {
    return { isStale: true, reason: "prompt-changed" };
  }

  return { isStale: false, reason: "up-to-date" };
}
