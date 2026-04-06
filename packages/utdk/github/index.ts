import type { CreateClientOptions } from "../client.js";
import { createClient, createLazyClient } from "../client.js";
import type { GithubClient } from "./types.js";
import openApiDocument from "./openapi.json" with { type: "json" };

export * from "./types.js";

export function createGithubClient(
  options: Omit<CreateClientOptions, "name" | "openApiDocument"> = {},
): Promise<GithubClient> {
  return createClient<GithubClient>({
    ...options,
    name: "github",
    openApiDocument,
  });
}

const defaultClient = createLazyClient(() => createGithubClient());

export default defaultClient;
