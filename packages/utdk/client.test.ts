import { afterEach, describe, expect, it, vi } from "vitest";

import { OpenApiConverter } from "@utcp/http";

import { assembleRequest, createClient, type ToolRuntimeMetadata } from "./client.js";

const metadata: ToolRuntimeMetadata = {
  accessPath: ["example", "call"],
  bodyKind: "properties",
  bodyPropertyKeys: ["id", "qux"],
  contentType: "application/json",
  headerParameterKeys: ["x-trace-id"],
  httpMethod: "POST",
  pathTemplate: "/v1/{id}/example",
  pathConflictKeys: ["id"],
  pathParameterKeys: ["id"],
  queryConflictKeys: ["id"],
  queryParameterKeys: ["id", "buzz"],
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("assembleRequest", () => {
  it("separates body, path, query, and headers for conflicting keys", () => {
    const request = assembleRequest(
      metadata,
      {
        id: "body-id",
        qux: "payload",
        buzz: "input-buzz",
      },
      {
        params: { id: "path-id" },
        query: { id: "query-id" },
        headers: { "x-trace-id": "trace-123" },
      },
    );

    expect(request).toEqual({
      body: {
        id: "body-id",
        qux: "payload",
      },
      headers: {
        "x-trace-id": "trace-123",
      },
      pathParams: {
        id: "path-id",
      },
      queryParams: {
        id: "query-id",
        buzz: "input-buzz",
      },
    });
  });

  it("keeps legacy explicit body wrappers working with transport params", () => {
    const legacyMetadata: ToolRuntimeMetadata = {
      ...metadata,
      queryConflictKeys: [],
      queryParameterKeys: ["buzz"],
    };

    const request = assembleRequest(legacyMetadata, {
      body: {
        id: "body-id",
        qux: "payload",
      },
      id: "path-id",
      buzz: "query-buzz",
    });

    expect(request).toEqual({
      body: {
        id: "body-id",
        qux: "payload",
      },
      headers: {},
      pathParams: {
        id: "path-id",
      },
      queryParams: {
        buzz: "query-buzz",
      },
    });
  });

  it("keeps unknown top-level keys in the body when promoted bodies allow additional properties", () => {
    const request = assembleRequest(
      {
        accessPath: ["spotify", "createPlaylist"],
        bodyAllowsAdditionalProperties: true,
        bodyKind: "properties",
        bodyPropertyKeys: ["name", "public"],
        contentType: "application/json",
        headerParameterKeys: [],
        httpMethod: "POST",
        pathTemplate: "/users/{user_id}/playlists",
        pathConflictKeys: [],
        pathParameterKeys: ["user_id"],
        queryConflictKeys: [],
        queryParameterKeys: ["market"],
      },
      {
        user_id: "alice",
        name: "Road Trip",
        collaborative: true,
        market: "US",
      },
    );

    expect(request).toEqual({
      body: {
        collaborative: true,
        name: "Road Trip",
      },
      headers: {},
      pathParams: {
        user_id: "alice",
      },
      queryParams: {
        market: "US",
      },
    });
  });
});

describe("createClient", () => {
  it("supports calling input-less methods without an empty object", async () => {
    const openApiDocument = {
      openapi: "3.0.0",
      info: { title: "Example", version: "1.0.0" },
      servers: [{ url: "https://api.example.com" }],
      paths: {
        "/queue": {
          get: {
            operationId: "get-queue",
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        ok: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/inspect": {
          get: {
            operationId: "inspect",
            parameters: [{ in: "header", name: "x-api-key", required: true, schema: { type: "string" } }],
            responses: {
              "200": {
                description: "ok",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        ok: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    } as const;
    const manual = new OpenApiConverter(openApiDocument, { callTemplateName: "example" }).convert();
    const getQueueToolName = manual.tools.find((tool) => tool.tool_call_template?.url === "https://api.example.com/queue")?.name;
    const inspectToolName = manual.tools.find((tool) => tool.tool_call_template?.url === "https://api.example.com/inspect")?.name;

    if (!getQueueToolName || !inspectToolName) {
      throw new Error("Expected converted tools for queue and inspect.");
    }

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    vi.stubGlobal("fetch", fetchMock);

    const client = await createClient<{
      getQueue: () => Promise<{ ok: boolean }>;
      inspect: (options: { headers: { "x-api-key": string } }) => Promise<{ ok: boolean }>;
    }>({
      name: "example",
      openApiDocument,
      toolMetadata: {
        [getQueueToolName]: {
          accessPath: ["getQueue"],
          bodyKind: "none",
          bodyPropertyKeys: [],
          contentType: "application/json",
          headerParameterKeys: [],
          httpMethod: "GET",
          pathTemplate: "/queue",
          pathConflictKeys: [],
          pathParameterKeys: [],
          queryConflictKeys: [],
          queryParameterKeys: [],
        },
        [inspectToolName]: {
          accessPath: ["inspect"],
          bodyKind: "none",
          bodyPropertyKeys: [],
          contentType: "application/json",
          headerParameterKeys: ["x-api-key"],
          httpMethod: "GET",
          pathTemplate: "/inspect",
          pathConflictKeys: [],
          pathParameterKeys: [],
          queryConflictKeys: [],
          queryParameterKeys: [],
        },
      },
      baseUrl: "https://api.example.com",
    });

    await client.getQueue();
    await client.inspect({ headers: { "x-api-key": "secret" } });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.example.com/queue",
      expect.objectContaining({
        method: "GET",
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://api.example.com/inspect",
      expect.objectContaining({
        headers: {
          "x-api-key": "secret",
        },
        method: "GET",
      }),
    );
  });
});
