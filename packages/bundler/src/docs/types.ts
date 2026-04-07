export const DOCS_MANIFEST_SCHEMA_VERSION = 1 as const;

export type DocsReferenceSource = "registry-seed" | "package-metadata" | "openapi";

export type DocsReferenceCategory = "overview" | "reference" | "guide" | "changelog" | "other";

export type DocsDiscoveredReference = {
  source: DocsReferenceSource;
  url: string;
  canonicalUrl?: string;
  label?: string;
  category?: DocsReferenceCategory;
  notes?: string;
};

export type DocsCachedSourceFile = {
  sourceUrl: string;
  canonicalUrl: string;
  category: DocsReferenceCategory;
  title?: string;
  contentType?: string;
  filePath: string;
  sha256: string;
  fetchedAt: string;
};

export type DocsManifest = {
  schemaVersion: number;
  provider: string;
  generatedAt: string;
  openApi: {
    url?: string;
    hash: string | null;
  };
  references: DocsDiscoveredReference[];
  sources: DocsCachedSourceFile[];
  warnings: string[];
};

export type ProviderPackageDocsMetadata = {
  manifestPath: string;
  indexPath: string;
  docsPath: string;
  generatedAt: string;
  sourceCount: number;
  openApiHash: string | null;
  promptHash: string | null;
};

export type DocsPipelineErrorCode =
  | "DOCS_CACHE_MISSING"
  | "DOCS_MANIFEST_INVALID"
  | "DOCS_MANIFEST_UNSUPPORTED_VERSION"
  | "DOCS_HASH_UNAVAILABLE"
  | "DOCS_OVERWRITE_BLOCKED";

export class DocsPipelineError extends Error {
  readonly code: DocsPipelineErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(code: DocsPipelineErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "DocsPipelineError";
    this.code = code;
    this.details = details;
  }
}
