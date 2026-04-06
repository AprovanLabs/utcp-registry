import { generateRegistryTypes } from "./index.js";

async function main(): Promise<void> {
  const [, , provider] = process.argv;

  if (!provider) {
    throw new Error('Expected a provider name.');
  }

  const result = await generateRegistryTypes({ provider });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
