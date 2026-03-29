import { Language, Parser } from "web-tree-sitter";
import type { FlowAnalysis, FlowArg, FlowStep } from "./types";

type NodeLike = {
  type: string;
  text: string;
  startPosition?: { row: number; column: number };
  endPosition?: { row: number; column: number };
  isNamed?: boolean;
  children: NodeLike[];
  namedChildren?: NodeLike[];
  childForFieldName?: (fieldName: string) => NodeLike | null;
};

type CommentInfo = {
  text: string;
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
};

const FN_NODE_TYPES = new Set([
  "function_declaration",
  "function_expression",
  "arrow_function",
  "generator_function_declaration",
  "generator_function",
]);

const BRANCH_METHODS = new Set(["then", "catch", "finally"]);

const parserReady = initParser();

async function initParser() {
  await Parser.init({
    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/web-tree-sitter/${file}`,
  });
  const parser = new Parser();
  const language = await Language.load(
    "https://cdn.jsdelivr.net/npm/tree-sitter-javascript/tree-sitter-javascript.wasm",
  );
  parser.setLanguage(language);
  return parser;
}

function namedChildrenOf(node?: NodeLike | null): NodeLike[] {
  if (!node) return [];
  return node.namedChildren ?? (node.children ?? []).filter((child) => child.isNamed);
}

function childOfType(node: NodeLike, type: string): NodeLike | null {
  for (const child of node.children) {
    if (child.type === type) return child;
  }
  return null;
}

function collectVariableDeclarators(node: NodeLike, out: NodeLike[] = []): NodeLike[] {
  for (const child of node.children ?? []) {
    if (child.type === "variable_declarator") out.push(child);
    collectVariableDeclarators(child, out);
  }
  return out;
}

function findFunctionNode(node: NodeLike): NodeLike | null {
  if (FN_NODE_TYPES.has(node.type)) return node;
  for (const child of namedChildrenOf(node)) {
    const fn = findFunctionNode(child);
    if (fn) return fn;
  }
  return null;
}

function extractFnParams(fnNode: NodeLike): Array<{ name: string }> {
  const params: Array<{ name: string }> = [];
  const namedKids = namedChildrenOf(fnNode);
  const fp =
    fnNode.childForFieldName?.("parameters") ??
    namedKids.find((child) => child.type === "formal_parameters") ??
    childOfType(fnNode, "formal_parameters");

  if (!fp) return params;

  for (const p of namedChildrenOf(fp)) {
    if (p.type === "identifier") {
      params.push({ name: p.text });
      continue;
    }

    if (p.type !== "object_pattern") continue;

    for (const prop of namedChildrenOf(p)) {
      if (prop.type === "shorthand_property_identifier_pattern") {
        params.push({ name: prop.text });
        continue;
      }
      if (prop.type === "pair_pattern") {
        const key = prop.childForFieldName?.("key")?.text;
        if (key) params.push({ name: key });
      }
    }
  }

  return params;
}

/** Collect ALL distinct variable names referenced in an expression node. */
function collectArgRefs(node: NodeLike | null | undefined, out: string[] = []): string[] {
  if (!node) return out;

  const add = (name: string) => {
    if (!out.includes(name)) out.push(name);
  };

  // foo.bar → the root object "foo"
  if (node.type === "member_expression") {
    // Walk down to the root identifier (e.g. user.name.length → "user")
    let root: NodeLike = node;
    while (root.type === "member_expression") {
      const obj = root.childForFieldName?.("object");
      if (!obj) break;
      root = obj;
    }
    if (root.type === "identifier") add(root.text);
    return out;
  }

  // Plain identifier
  if (node.type === "identifier") {
    add(node.text);
    return out;
  }

  // `Hello, ${user.name}` — template literal
  if (node.type === "template_string") {
    for (const child of node.children ?? []) {
      if (child.type === "template_substitution") {
        for (const inner of namedChildrenOf(child)) {
          collectArgRefs(inner, out);
        }
      }
    }
    return out;
  }

  // 'To: ' + email  /  a + b + c
  if (node.type === "binary_expression") {
    for (const child of namedChildrenOf(node)) {
      collectArgRefs(child, out);
    }
    return out;
  }

  // { foo, bar: baz }
  if (node.type === "object") {
    for (const prop of namedChildrenOf(node)) {
      if (prop.type === "shorthand_property_identifier") {
        add(prop.text);
      } else if (prop.type === "pair") {
        collectArgRefs(prop.childForFieldName?.("value"), out);
      }
    }
    return out;
  }

  // Array literal [ a, b ]
  if (node.type === "array") {
    for (const child of namedChildrenOf(node)) collectArgRefs(child, out);
    return out;
  }

  return out;
}

function parseImport(node: NodeLike): { name: string; module: string } | null {
  let name: string | null = null;
  const clause = childOfType(node, "import_clause");

  if (clause) {
    name =
      childOfType(clause, "identifier")?.text?.trim() ??
      childOfType(clause, "import_default_specifier")?.text?.trim() ??
      null;

    if (!name) {
      const namedImports = childOfType(clause, "named_imports");
      if (namedImports) {
        for (const spec of namedImports.children) {
          if (spec.type !== "import_specifier") continue;
          name =
            spec.childForFieldName?.("name")?.text?.trim() ??
            childOfType(spec, "identifier")?.text?.trim() ??
            null;
          if (name) break;
        }
      }
    }
  }

  if (!name) {
    name = childOfType(node, "import_default_specifier")?.text?.trim() ?? null;
  }

  const source = node.childForFieldName?.("source") ?? childOfType(node, "string");
  const moduleName = source?.text?.replace(/['"]/g, "").trim() ?? null;

  if (!name || !moduleName) return null;
  return { name, module: moduleName };
}

function isPromiseAllCall(callNode: NodeLike): boolean {
  const fn = callNode.childForFieldName?.("function");
  if (!fn || fn.type !== "member_expression") return false;
  return (
    fn.childForFieldName?.("object")?.text === "Promise" &&
    fn.childForFieldName?.("property")?.text === "all"
  );
}

type ParseContext = {
  makeStepId: () => number;
  comments: CommentInfo[];
};

function makeParseContext(comments: CommentInfo[]): ParseContext {
  let nextStepId = 1;
  return {
    makeStepId: () => {
      const stepId = nextStepId;
      nextStepId += 1;
      return stepId;
    },
    comments,
  };
}

function normalizeCommentText(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("//")) {
    const text = trimmed.replace(/^\/\/\s?/, "").trim();
    return text.length > 0 ? text : null;
  }

  if (trimmed.startsWith("/*")) {
    const body = trimmed
      .replace(/^\/\*+/, "")
      .replace(/\*+\/$/, "")
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter((line) => line.length > 0)
      .join(" ")
      .trim();
    return body.length > 0 ? body : null;
  }

  return trimmed;
}

function collectComments(node: NodeLike, out: CommentInfo[] = []): CommentInfo[] {
  if (node.type === "comment") {
    const text = normalizeCommentText(node.text);
    const start = node.startPosition;
    const end = node.endPosition;

    if (text && start && end) {
      out.push({
        text,
        startRow: start.row,
        startColumn: start.column,
        endRow: end.row,
        endColumn: end.column,
      });
    }
  }

  for (const child of node.children ?? []) {
    collectComments(child, out);
  }

  return out;
}

function extractDescriptionForNode(node: NodeLike, comments: CommentInfo[]): string | null {
  const start = node.startPosition;
  const end = node.endPosition;
  if (!start || !end || comments.length === 0) return null;

  const inline = comments
    .filter(
      (comment) =>
        comment.startRow === end.row &&
        comment.startColumn >= end.column,
    )
    .sort((a, b) => a.startColumn - b.startColumn)
    .at(0);

  if (inline) return inline.text;

  const above = comments
    .filter((comment) => comment.endRow === start.row - 1)
    .sort((a, b) => b.endColumn - a.endColumn)
    .at(0);

  return above?.text ?? null;
}

function parseCallNode(
  callNode: NodeLike,
  opts: { produces: string | null; isAwait: boolean },
  context: ParseContext,
): FlowStep {
  const fn = callNode.childForFieldName?.("function");
  const argv = callNode.childForFieldName?.("arguments") ?? childOfType(callNode, "arguments");

  let object: string | null = null;
  let method: string | null = null;

  if (fn?.type === "member_expression") {
    object = fn.childForFieldName?.("object")?.text ?? null;
    method = fn.childForFieldName?.("property")?.text ?? null;
  } else if (fn?.type === "identifier") {
    method = fn.text;
  }

  const args: FlowArg[] = [];
  for (const arg of namedChildrenOf(argv)) {
    args.push({
      text: arg.text,
      refVars: collectArgRefs(arg),
    });
  }

  const step: FlowStep = {
    id: context.makeStepId(),
    object,
    method,
    description: extractDescriptionForNode(callNode, context.comments),
    args,
    produces: opts.produces,
    isAwait: opts.isAwait,
    nested: [],
    parallel: false,
    calls: [],
  };

  if (isPromiseAllCall(callNode)) {
    const arrayNode = namedChildrenOf(argv).find((node) => node.type === "array");
    step.parallel = true;
    step.object = "Promise";
    step.method = "all";

    if (arrayNode) {
      for (const elem of namedChildrenOf(arrayNode)) {
        const parsed = parseExpressionToSteps(
          elem,
          { produces: null, isAwait: false },
          context,
        );
        step.calls.push(...parsed);
      }
    }
  }

  return step;
}

function parseFunctionBodySteps(fnNode: NodeLike, context: ParseContext): FlowStep[] {
  const body =
    fnNode.childForFieldName?.("body") ??
    namedChildrenOf(fnNode).find(
      (node) => node.type === "statement_block" || node.type.endsWith("expression"),
    );

  if (!body) return [];

  if (body.type === "statement_block") {
    return parseStatements(namedChildrenOf(body), context);
  }

  return parseExpressionToSteps(body, { produces: null, isAwait: false }, context);
}

function parseCallChain(
  callNode: NodeLike,
  opts: { produces: string | null; isAwait: boolean },
  context: ParseContext,
): FlowStep {
  const chain: Array<{ method: string; callNode: NodeLike }> = [];
  let cursor: NodeLike | null = callNode;

  while (cursor?.type === "call_expression") {
    const fn: NodeLike | null | undefined = cursor.childForFieldName?.("function");
    if (!fn || fn.type !== "member_expression") break;

    const objectExpr: NodeLike | null | undefined = fn.childForFieldName?.("object");
    if (!objectExpr || objectExpr.type !== "call_expression") break;

    chain.unshift({
      method: fn.childForFieldName?.("property")?.text ?? "call",
      callNode: cursor,
    });

    cursor = objectExpr;
  }

  const baseStep = parseCallNode(cursor ?? callNode, opts, context);

  for (const link of chain) {
    if (!BRANCH_METHODS.has(link.method)) continue;

    const argv =
      link.callNode.childForFieldName?.("arguments") ?? childOfType(link.callNode, "arguments");

    const branchSteps: FlowStep[] = [];
    for (const arg of namedChildrenOf(argv)) {
      if (!FN_NODE_TYPES.has(arg.type)) continue;
      branchSteps.push(...parseFunctionBodySteps(arg, context));
    }

    if (branchSteps.length > 0) {
      baseStep.nested.push({
        label: link.method as "then" | "catch" | "finally",
        steps: branchSteps,
      });
    }
  }

  return baseStep;
}

function parseExpressionToSteps(
  expr: NodeLike | null | undefined,
  opts: { produces: string | null; isAwait: boolean },
  context: ParseContext,
): FlowStep[] {
  if (!expr) return [];

  if (expr.type === "parenthesized_expression") {
    return parseExpressionToSteps(namedChildrenOf(expr)[0], opts, context);
  }

  if (expr.type === "await_expression") {
    const awaited = expr.childForFieldName?.("expression") ?? namedChildrenOf(expr)[0];
    return parseExpressionToSteps(awaited, { ...opts, isAwait: true }, context);
  }

  if (expr.type === "call_expression") {
    return [parseCallChain(expr, opts, context)];
  }

  return [];
}

function parseStatements(nodes: NodeLike[], context: ParseContext): FlowStep[] {
  const steps: FlowStep[] = [];

  for (const node of nodes) {
    if (node.type === "lexical_declaration" || node.type === "variable_declaration") {
      for (const decl of collectVariableDeclarators(node)) {
        const nameNode = decl.childForFieldName?.("name");
        const valueNode = decl.childForFieldName?.("value");
        if (!valueNode) continue;

        steps.push(
          ...parseExpressionToSteps(
            valueNode,
            { produces: nameNode?.text ?? null, isAwait: false },
            context,
          ),
        );
      }
      continue;
    }

    if (node.type === "expression_statement") {
      const expr = namedChildrenOf(node)[0] ?? node.children?.[0];
      steps.push(...parseExpressionToSteps(expr, { produces: null, isAwait: false }, context));
      continue;
    }

    if (node.type === "return_statement") {
      const expr =
        node.childForFieldName?.("argument") ??
        namedChildrenOf(node).find((child) => child.type.endsWith("expression"));
      steps.push(...parseExpressionToSteps(expr, { produces: null, isAwait: false }, context));
    }
  }

  return steps;
}

function buildGlobalProducedMap(steps: FlowStep[], params: Array<{ name: string }>): Map<string, number> {
  const produced = new Map<string, number>();
  for (const param of params) produced.set(param.name, -1);

  let ordinal = 0;

  const visit = (list: FlowStep[]) => {
    for (const step of list) {
      if (step.produces && !produced.has(step.produces)) {
        produced.set(step.produces, ordinal);
      }
      ordinal += 1;

      if (step.parallel && step.calls.length > 0) {
        visit(step.calls);
      }

      for (const nested of step.nested) {
        visit(nested.steps);
      }
    }
  };

  visit(steps);
  return produced;
}

export function buildLocalProducedMap(
  steps: FlowStep[],
  params: Array<{ name: string }>,
): Map<string, number> {
  const produced = new Map<string, number>();
  for (const param of params) produced.set(param.name, -1);

  for (const [index, step] of steps.entries()) {
    if (step.produces) {
      produced.set(step.produces, index);
    }
  }

  return produced;
}

export async function analyzeScript(source: string): Promise<FlowAnalysis> {
  const parser = await parserReady;
  const tree = parser.parse(source);
  if (!tree) {
    throw new Error("Parser returned no syntax tree");
  }
  const root = tree.rootNode as unknown as NodeLike;
  const comments = collectComments(root);

  const imports: Array<{ name: string; module: string }> = [];
  const statements: NodeLike[] = [];
  let params: Array<{ name: string }> = [];
  let fnName: string | null = null;

  for (const node of root.children) {
    if (node.type === "import_statement") {
      const parsed = parseImport(node);
      if (parsed) imports.push(parsed);
      continue;
    }
    statements.push(node);
  }

  let bodyNodes = statements;

  const first = statements.at(0);
  if (first) {
    const isExport =
      first.type === "export_statement" || first.type === "export_declaration";

    if (isExport) {
      const fn = findFunctionNode(first);
      if (fn) {
        fnName = fn.childForFieldName?.("name")?.text ?? null;
        params = extractFnParams(fn);

        const body =
          fn.childForFieldName?.("body") ??
          namedChildrenOf(fn).find((child) => child.type === "statement_block") ??
          childOfType(fn, "statement_block");

        if (body) {
          bodyNodes = namedChildrenOf(body);
        }
      }
    }
  }

  const context = makeParseContext(comments);
  const steps = parseStatements(bodyNodes, context);
  const produced = buildGlobalProducedMap(steps, params);

  return {
    imports,
    steps,
    produced,
    params,
    fnName,
  };
}
