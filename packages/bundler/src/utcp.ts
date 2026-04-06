import { HttpCallTemplateSerializer } from "@utcp/http";
import { UtcpClient, UtcpClientConfigSerializer, type Tool } from "@utcp/sdk";

import type { RegistryProvider } from "./provider.js";

export type LoadedProviderTools = {
  tools: Tool[];
};

export async function loadProviderTools(provider: RegistryProvider): Promise<LoadedProviderTools> {
  const serializer = new HttpCallTemplateSerializer();
  const config = new UtcpClientConfigSerializer().validateDict({
    manual_call_templates: [
      serializer.validateDict({
        name: provider.name,
        call_template_type: "http",
        http_method: provider.http_method ?? "GET",
        url: provider.url,
        content_type: provider.content_type ?? "application/json",
      }),
    ],
  });
  const client = await UtcpClient.create(process.cwd(), config);

  try {
    return {
      tools: await client.getTools(),
    };
  } finally {
    await client.close();
  }
}
