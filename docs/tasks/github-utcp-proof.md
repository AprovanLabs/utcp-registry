# GitHub UTCP Proof

## Plan

1. Build the bundler foundation and CLI entrypoint.
2. Fetch/cache the GitHub OpenAPI source and normalize it into manifest, manual, docs, and markdown artifacts.
3. Generate `@utdk/github` from the normalized model and wire `apps/registry` to those exports.
4. Add focused tests and run targeted verification.

## Progress

- [completed] Establish package structure and dependency choices.
- [completed] Implement source intake and deterministic manifest generation.
- [completed] Implement UTCP/manual/docs generation and markdown output.
- [completed] Generate `@utdk/github` and rewire `apps/registry`.
- [completed] Add tests and run verification.

## Shared Runtime Refactor

### Plan

1. Replace provider-specific generated runtime files with a single shared `utdk` client utility.
2. Emit provider `openapi.json` assets plus a single generated `types.ts` per provider.
3. Generate lazy provider entrypoints that delegate first-call initialization to the shared utility.
4. Regenerate `packages/utdk` and verify build/typecheck behavior.

### Progress

- [completed] Refactor `packages/bundler` to emit shared-runtime-compatible `utdk` outputs.
- [completed] Regenerate `packages/utdk` with a single shared runtime helper plus provider `openapi.json` assets.
- [completed] Verify lazy first-call execution and package/typecheck behavior.
