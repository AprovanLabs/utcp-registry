import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { marked } from "marked";

type OpenApiDocument = {
  info?: {
    title?: string;
    version?: string;
    description?: string;
    termsOfService?: string;
  };
  paths?: Record<string, Record<string, unknown>>;
};

type UtdkManifest = {
  name?: string;
  version?: string;
  description?: string;
  homepage?: string;
  license?: string;
  utdk?: {
    namespace?: string;
    provider?: string;
    providers?: string[];
    generation?: number;
    generatedAt?: string;
    openapi?: {
      title?: string;
      url?: string;
      version?: string;
      termsOfService?: string;
      icon?: string;
    };
  };
};

export type RegistryDocPage = {
  slug: string;
  title: string;
  markdown: string;
  html: string;
};

export type RegistryEntry = {
  kind: "namespace" | "provider";
  providerPath: string;
  packageName: string;
  title: string;
  description: string | null;
  summary: string | null;
  version: string | null;
  homepage: string | null;
  license: string | null;
  generatedAt: string | null;
  openApiTitle: string | null;
  openApiVersion: string | null;
  openApiUrl: string | null;
  termsOfService: string | null;
  openApiIcon: string | null;
  operationCount: number;
  parentProviderPath: string | null;
  parentPackageName: string | null;
  childProviderPaths: string[];
  readmeMarkdown: string | null;
  readmeHtml: string | null;
  docs: RegistryDocPage[];
  importSample: string;
  createClientSample: string | null;
};

export type RegistryCatalog = {
  entries: RegistryEntry[];
  namespaceCount: number;
  providerCount: number;
  documentedCount: number;
  updatedAt: string | null;
};

const workspaceRoot = findWorkspaceRoot(process.cwd());
const packagesRoot = path.join(workspaceRoot, "packages", "utdk");

let registryCatalogPromise: Promise<RegistryCatalog> | undefined;

export async function getRegistryCatalog(): Promise<RegistryCatalog> {
  registryCatalogPromise ??= buildRegistryCatalog();
  return registryCatalogPromise;
}

export async function getRegistryEntry(
  providerPath: string,
): Promise<RegistryEntry | undefined> {
  const catalog = await getRegistryCatalog();

  return catalog.entries.find((entry) => entry.providerPath === providerPath);
}

export async function getRegistryRoutes(): Promise<
  Array<{ slug: string[]; providerPath: string; docSlug: string | null }>
> {
  const catalog = await getRegistryCatalog();

  return catalog.entries.flatMap((entry) => {
    const overviewRoute = {
      slug: entry.providerPath.split("/"),
      providerPath: entry.providerPath,
      docSlug: null,
    };

    const docRoutes = entry.docs.map((doc) => ({
      slug: [...entry.providerPath.split("/"), "docs", ...doc.slug.split("/")],
      providerPath: entry.providerPath,
      docSlug: doc.slug,
    }));

    return [overviewRoute, ...docRoutes];
  });
}

export function getDocPage(
  entry: RegistryEntry,
  docSlug: string | null,
): RegistryDocPage | null {
  if (!docSlug) {
    return null;
  }

  return entry.docs.find((doc) => doc.slug === docSlug) ?? null;
}

async function buildRegistryCatalog(): Promise<RegistryCatalog> {
  const candidatePaths = await discoverEntryDirectories(packagesRoot);

  const entries = (
    await Promise.all(
      candidatePaths.map(async (relativePath) =>
        buildRegistryEntry(relativePath),
      ),
    )
  )
    .filter((entry): entry is RegistryEntry => entry !== null)
    .sort((left, right) =>
      left.providerPath.localeCompare(right.providerPath, undefined, {
        sensitivity: "base",
      }),
    );

  const entryMap = new Map(entries.map((entry) => [entry.providerPath, entry]));

  for (const entry of entries) {
    if (entry.kind === "namespace") {
      const manifestChildPaths = entry.childProviderPaths.filter((providerPath) =>
        entryMap.has(providerPath),
      );

      entry.childProviderPaths = manifestChildPaths.length
        ? manifestChildPaths
        : entries
            .filter((candidate) => candidate.parentProviderPath === entry.providerPath)
            .map((candidate) => candidate.providerPath)
            .sort();
    }

    if (entry.parentProviderPath) {
      entry.parentPackageName =
        entryMap.get(entry.parentProviderPath)?.packageName ?? null;
    }
  }

  const documentedCount = entries.filter(
    (entry) => entry.readmeHtml || entry.docs.length > 0,
  ).length;
  const updatedAt = entries.reduce<string | null>((latest, entry) => {
    if (!entry.generatedAt) {
      return latest;
    }

    if (!latest) {
      return entry.generatedAt;
    }

    return entry.generatedAt > latest ? entry.generatedAt : latest;
  }, null);

  return {
    entries,
    namespaceCount: entries.filter((entry) => entry.kind === "namespace").length,
    providerCount: entries.filter((entry) => entry.kind === "provider").length,
    documentedCount,
    updatedAt,
  };
}

async function buildRegistryEntry(
  relativePath: string,
): Promise<RegistryEntry | null> {
  const absolutePath = path.join(packagesRoot, relativePath);
  const manifest = await readJson<UtdkManifest>(path.join(absolutePath, "package.json"));
  const openApiDocument = await readJson<OpenApiDocument>(
    path.join(absolutePath, "openapi.json"),
  );
  const readmeMarkdown = await readText(path.join(absolutePath, "README.md"));
  const docs = await loadDocs(path.join(absolutePath, "docs"));

  const manifestNamespace = manifest?.utdk?.namespace ?? null;
  const manifestProvider = manifest?.utdk?.provider ?? null;
  const providerPath = manifestNamespace ?? manifestProvider ?? relativePath;

  if (!providerPath || providerPath === ".") {
    return null;
  }

  const kind = manifestNamespace ? "namespace" : "provider";
  const packageName = manifest?.name ?? `@utdk/${providerPath}`;
  const title =
    manifest?.utdk?.openapi?.title ??
    openApiDocument?.info?.title ??
    toDisplayTitle(providerPath);
  const description = collapseWhitespace(
    manifest?.description ?? openApiDocument?.info?.description ?? null,
  );
  const summary = extractSummary(readmeMarkdown) ?? description;
  const readmeHtml = readmeMarkdown ? renderMarkdown(readmeMarkdown) : null;
  const childProviderPaths =
    kind === "namespace" ? [...(manifest?.utdk?.providers ?? [])].sort() : [];
  const parentProviderPath =
    kind === "provider" && providerPath.includes("/")
      ? path.posix.dirname(providerPath)
      : null;

  return {
    kind,
    providerPath,
    packageName,
    title,
    description,
    summary,
    version: manifest?.version ?? openApiDocument?.info?.version ?? null,
    homepage: manifest?.homepage ?? null,
    license: manifest?.license ?? null,
    generatedAt: manifest?.utdk?.generatedAt ?? null,
    openApiTitle:
      manifest?.utdk?.openapi?.title ?? openApiDocument?.info?.title ?? null,
    openApiVersion:
      manifest?.utdk?.openapi?.version ?? openApiDocument?.info?.version ?? null,
    openApiUrl: manifest?.utdk?.openapi?.url ?? null,
    termsOfService:
      manifest?.utdk?.openapi?.termsOfService ??
      openApiDocument?.info?.termsOfService ??
      null,
    openApiIcon: manifest?.utdk?.openapi?.icon ?? null,
    operationCount: countOperations(openApiDocument),
    parentProviderPath,
    parentPackageName: null,
    childProviderPaths,
    readmeMarkdown,
    readmeHtml,
    docs,
    importSample: buildImportSample(kind, packageName, providerPath, childProviderPaths),
    createClientSample:
      kind === "provider"
        ? `import { create${toPascalCase(providerPath)}Client } from "${packageName}"`
        : null,
  };
}

async function discoverEntryDirectories(rootDirectory: string): Promise<string[]> {
  const directories = await walkDirectories(rootDirectory);

  const entryDirectories: string[] = [];

  for (const directory of directories) {
    const relativePath = path.relative(rootDirectory, directory);

    if (
      !relativePath ||
      relativePath === "." ||
      relativePath.split(path.sep).includes("docs")
    ) {
      continue;
    }

    const hasManifest = await readJson<UtdkManifest>(path.join(directory, "package.json"));
    const hasReadme = await readText(path.join(directory, "README.md"));
    const hasOpenApi = await readText(path.join(directory, "openapi.json"));

    if (hasManifest || hasReadme || hasOpenApi) {
      entryDirectories.push(relativePath.split(path.sep).join("/"));
    }
  }

  return entryDirectories;
}

async function walkDirectories(directory: string): Promise<string[]> {
  const children = await readdir(directory, { withFileTypes: true });
  const nestedDirectories: string[] = [];

  for (const child of children) {
    if (
      !child.isDirectory() ||
      child.name.startsWith(".") ||
      child.name === "dist" ||
      child.name === "node_modules"
    ) {
      continue;
    }

    const childPath = path.join(directory, child.name);

    nestedDirectories.push(childPath);
    nestedDirectories.push(...(await walkDirectories(childPath)));
  }

  return nestedDirectories;
}

async function loadDocs(docsDirectory: string): Promise<RegistryDocPage[]> {
  const markdownFiles = await walkMarkdownFiles(docsDirectory);

  const docs = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const markdown = await readFile(filePath, "utf8");
      const relativePath = path
        .relative(docsDirectory, filePath)
        .split(path.sep)
        .join("/");
      const slug = normalizeDocSlug(relativePath);

      return {
        slug,
        title: extractHeading(markdown) ?? toDisplayTitle(slug),
        markdown,
        html: renderMarkdown(markdown),
      };
    }),
  );

  return docs.sort((left, right) =>
    left.slug.localeCompare(right.slug, undefined, { sensitivity: "base" }),
  );
}

async function walkMarkdownFiles(directory: string): Promise<string[]> {
  try {
    const children = await readdir(directory, { withFileTypes: true });
    const markdownFiles: string[] = [];

    for (const child of children) {
      const childPath = path.join(directory, child.name);

      if (child.isDirectory()) {
        markdownFiles.push(...(await walkMarkdownFiles(childPath)));
        continue;
      }

      if (child.isFile() && /\.(md|mdx)$/i.test(child.name)) {
        markdownFiles.push(childPath);
      }
    }

    return markdownFiles;
  } catch {
    return [];
  }
}

async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const content = await readFile(filePath, "utf8");

    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

async function readText(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

function countOperations(openApiDocument: OpenApiDocument | null): number {
  if (!openApiDocument?.paths) {
    return 0;
  }

  const methods = new Set([
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "head",
    "options",
    "trace",
  ]);

  return Object.values(openApiDocument.paths).reduce((count, pathDefinition) => {
    return (
      count +
      Object.keys(pathDefinition).filter((method) => methods.has(method)).length
    );
  }, 0);
}

function buildImportSample(
  kind: RegistryEntry["kind"],
  packageName: string,
  providerPath: string,
  childProviderPaths: string[],
): string {
  if (kind === "namespace") {
    const firstChild = childProviderPaths[0];

    if (firstChild) {
      return `import { ${toImportIdentifier(firstChild)} } from "${packageName}"`;
    }

    return `import * as ${toImportIdentifier(providerPath)} from "${packageName}"`;
  }

  return `import ${toImportIdentifier(providerPath)} from "${packageName}"`;
}

function toImportIdentifier(value: string): string {
  const parts = value
    .split("/")
    .flatMap((segment) => segment.split(/[^a-zA-Z0-9]+/))
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());

  const [firstPart = "client", ...rest] = parts;

  return [
    firstPart,
    ...rest.map((segment) => segment[0]!.toUpperCase() + segment.slice(1)),
  ].join("");
}

function toPascalCase(value: string): string {
  return value
    .split("/")
    .flatMap((segment) => segment.split(/[^a-zA-Z0-9]+/))
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1).toLowerCase())
    .join("");
}

function toDisplayTitle(value: string): string {
  return value
    .split("/")
    .map((segment) =>
      segment
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
        .map((part) => part[0]!.toUpperCase() + part.slice(1))
        .join(" "),
    )
    .join(" / ");
}

function normalizeDocSlug(relativePath: string): string {
  const withoutExtension = relativePath.replace(/\.(md|mdx)$/i, "");

  if (withoutExtension.endsWith("/index")) {
    return withoutExtension.slice(0, -"/index".length);
  }

  return withoutExtension;
}

function extractHeading(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);

  return match ? collapseWhitespace(match[1]) : null;
}

function extractSummary(markdown: string | null): string | null {
  if (!markdown) {
    return null;
  }

  const lines = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"));

  if (!lines.length) {
    return null;
  }

  return collapseWhitespace(stripMarkdown(lines[0] ?? ""));
}

function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_>#-]/g, " ")
    .trim();
}

function collapseWhitespace(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/\s+/g, " ").trim();
}

function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

function findWorkspaceRoot(startDirectory: string): string {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    if (existsSync(path.join(currentDirectory, "packages", "utdk"))) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      throw new Error("Could not locate workspace root containing packages/utdk.");
    }

    currentDirectory = parentDirectory;
  }
}
