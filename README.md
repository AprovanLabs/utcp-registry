# Stitchery

Generate, manage, and serve high-quality 3rd party integrations.

## Modules

_While Stitchery prefers TypeScript as the first-party supported language, all design decisions are open for implementation in other languages._

- [packages/stitchery](packages/stitchery): Serve and manage permissions/credentials for user-level access to 3rd party applications.
    - Supports exposing 3rd party applications as MCP toolkits
    - Optionally search available tools via management endpoints and tools
    - A built-in, Isolate runtime allows running sandboxed tools as TypeScript modules
- [packages/bundler](packages/bundler): Combine scraped 3rd party OpenAPI specs and associated documentation to auto-generate versioned 3rd party MCP clients
- [apps/registry](apps/registry): Registry web app for searching versioned 3rd party APIs and registering integration credentials.
    - View and consume 3rd party API docs as regular MCP tool endpoints _or_ as an SDK for the sandboxed Isolate runtime
- [apps/tailor](apps/tailor): Generate single-file scripts in a web app which reference the Stitchery-generated SDK tooling.
    - Integrates neatly with the Stitchery SDK docs by relying on a Stitchery MCP endpoint to search documentation as TypeScript files
