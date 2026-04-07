import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  assertSupportedDocsManifestVersion,
  createDocsManifest,
  readDocsManifest,
  readDocsManifestOrDefault,
  writeDocsManifest,
} from "./manifest.js";
import { DOCS_MANIFEST_SCHEMA_VERSION } from "./types.js";

const tempDirs: string[] = [];

async function createTempDir(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "bundler-docs-manifest-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("docs manifest helpers", () => {
  it("writes and reads manifest round-trips with schema version", async () => {
    const dir = await createTempDir();
    const manifestPath = path.join(dir, "manifest.json");

    const manifest = createDocsManifest("google/books", {
      openApi: { hash: "abc123", url: "https://example.com/openapi.json" },
      references: [
        {
          source: "openapi",
          url: "https://example.com/docs",
          category: "reference",
        },
      ],
      warnings: ["no changelog source"],
    });

    await writeDocsManifest(manifestPath, manifest);
    const reloaded = await readDocsManifest(manifestPath);

    expect(reloaded).toEqual(manifest);
  });

  it("returns undefined for missing manifest and supports default manifest fallback", async () => {
    const dir = await createTempDir();
    const missingPath = path.join(dir, "does-not-exist.json");

    expect(await readDocsManifest(missingPath)).toBeUndefined();

    const fallback = await readDocsManifestOrDefault(missingPath, "openai");
    expect(fallback.provider).toBe("openai");
    expect(fallback.schemaVersion).toBe(DOCS_MANIFEST_SCHEMA_VERSION);
    expect(fallback.references).toEqual([]);
  });

  it("supports legacy schema_version fields and enforces supported versions", async () => {
    const dir = await createTempDir();
    const legacyPath = path.join(dir, "legacy.json");

    await writeFile(
      legacyPath,
      JSON.stringify({
        schema_version: DOCS_MANIFEST_SCHEMA_VERSION,
        provider: "legacy/provider",
        generatedAt: "2026-04-07T00:00:00.000Z",
      }),
      "utf8",
    );

    const legacy = await readDocsManifest(legacyPath);
    expect(legacy?.schemaVersion).toBe(DOCS_MANIFEST_SCHEMA_VERSION);
    expect(legacy?.provider).toBe("legacy/provider");

    expect(() => assertSupportedDocsManifestVersion(DOCS_MANIFEST_SCHEMA_VERSION + 1)).toThrow(
      "Unsupported docs manifest schema version",
    );
  });
});
