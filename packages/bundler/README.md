# Bundler

Generate a provider client package from a provider OpenAPI schema listed in `data/registry.json`.

## Run

From the repo root:

```sh
pnpm --filter @aprovan/stitchery-bundler generate github
```

From `packages/bundler/`:

```sh
pnpm generate github
```

This reads the matching provider entry from `data/registry.json`, discovers the provider through UTCP, and writes the generated package files to:

```text
packages/utdk/
packages/utdk/<provider>/
```

Current example provider:

- `github`
