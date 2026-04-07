import { describe, expect, it } from "vitest";

import { getDocsStaleCheckResult, hashOpenApiDocument } from "./hash.js";

describe("docs hash helpers", () => {
  it("creates stable OpenAPI hashes independent of object key order", () => {
    const left = {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Example",
      },
      paths: {
        "/users": {
          get: {
            operationId: "users.list",
          },
        },
      },
    };

    const right = {
      paths: {
        "/users": {
          get: {
            operationId: "users.list",
          },
        },
      },
      info: {
        title: "Example",
        version: "1.0.0",
      },
      openapi: "3.0.0",
    };

    expect(hashOpenApiDocument(left)).toBe(hashOpenApiDocument(right));
  });

  it("marks stale when OpenAPI hash changes", () => {
    expect(
      getDocsStaleCheckResult({
        previousOpenApiHash: "old",
        nextOpenApiHash: "new",
      }),
    ).toEqual({ isStale: true, reason: "openapi-changed" });
  });

  it("marks stale when prompt hash changes and up-to-date when all hashes match", () => {
    expect(
      getDocsStaleCheckResult({
        previousPromptHash: "prompt-a",
        nextPromptHash: "prompt-b",
      }),
    ).toEqual({ isStale: true, reason: "prompt-changed" });

    expect(
      getDocsStaleCheckResult({
        previousManifestVersion: 1,
        expectedManifestVersion: 1,
        previousOpenApiHash: "openapi",
        nextOpenApiHash: "openapi",
        previousPromptHash: "prompt",
        nextPromptHash: "prompt",
      }),
    ).toEqual({ isStale: false, reason: "up-to-date" });
  });
});
