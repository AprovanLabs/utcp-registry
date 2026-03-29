import { useCallback, useEffect, useMemo, useState } from "react";
import { Background, Controls, ReactFlow } from "@xyflow/react";

import { analyzeScript } from "../lib/flow-analyzer";
import { buildGraph } from "../lib/graph-builder";
import { SOURCE } from "../lib/source";
import type { FlowAnalysis, FocusView } from "../lib/types";
import { StepNode } from "./StepNode";
import { ParallelNode } from "./ParallelNode";
import { Breadcrumbs } from "./Breadcrumbs";
import { ImportsPanel } from "./ImportsPanel";
import { ParamsPanel } from "./ParamsPanel";

const nodeTypes = {
  step: StepNode,
  parallel: ParallelNode,
};

export function Tailor() {
  const [source, setSource] = useState(SOURCE);
  const [analysis, setAnalysis] = useState<FlowAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [focusStack, setFocusStack] = useState<FocusView[]>([]);
  // inputValues: param name → user-typed value (persisted across focus navigation)
  const [inputValues, setInputValues] = useState<Map<string, string>>(new Map());

  // Debounced parse — reset focus + inputs when source changes
  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      analyzeScript(source)
        .then((nextAnalysis) => {
          if (!active) return;
          setAnalysis(nextAnalysis);
          setFocusStack([]);
          // Preserve existing input values; add empty entries for new params
          setInputValues((prev) => {
            const next = new Map(prev);
            for (const p of nextAnalysis.params) {
              if (!next.has(p.name)) next.set(p.name, "");
            }
            return next;
          });
          setError(null);
        })
        .catch((nextError: unknown) => {
          if (!active) return;
          setError(
            nextError instanceof Error ? nextError.message : "Failed to parse source",
          );
        });
    }, 260);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [source]);

  const handleParamChange = useCallback((name: string, value: string) => {
    setInputValues((prev) => {
      const next = new Map(prev);
      next.set(name, value);
      return next;
    });
  }, []);

  const current = useMemo<FocusView | null>(() => {
    if (!analysis) return null;
    return (
      focusStack[focusStack.length - 1] ?? {
        title: analysis.fnName ? `${analysis.fnName}( )` : "root",
        steps: analysis.steps,
        fromStepId: null,
      }
    );
  }, [analysis, focusStack]);

  const handleOpen = useCallback(
    (stepId: number, label: "then" | "catch" | "finally") => {
      if (!current) return;
      const step = current.steps.find((s) => s.id === stepId);
      if (!step) return;
      const block = step.nested.find((n) => n.label === label);
      if (!block) return;
      const object = step.object ? `${step.object}.` : "";
      const method = step.method ?? "call";
      setFocusStack((prev) => [
        ...prev,
        {
          title: `${object}${method}( ) · ${label}`,
          steps: block.steps,
          fromStepId: step.id,
        },
      ]);
    },
    [current],
  );

  const handleOpenCallBranch = useCallback(
    (stepId: number, callIndex: number, label: "then" | "catch" | "finally") => {
      if (!current) return;
      const step = current.steps.find((s) => s.id === stepId);
      if (!step) return;
      const call = step.calls[callIndex];
      if (!call) return;
      const block = call.nested.find((n) => n.label === label);
      if (!block) return;
      const object = call.object ? `${call.object}.` : "";
      const method = call.method ?? "call";
      setFocusStack((prev) => [
        ...prev,
        {
          title: `${object}${method}( ) · ${label}`,
          steps: block.steps,
          fromStepId: call.id,
        },
      ]);
    },
    [current],
  );

  const graph = useMemo(() => {
    if (!analysis || !current) return { nodes: [], edges: [] };
    return buildGraph(analysis, current, inputValues, handleOpen, handleOpenCallBranch);
  }, [analysis, current, inputValues, handleOpen, handleOpenCallBranch]);

  const atRoot = focusStack.length === 0;

  return (
    <main className="min-h-screen flex flex-col p-5 gap-4 bg-bg text-text font-sans">
      {/* Top bar */}
      <header>
        <h1 className="m-0 text-[1.45rem] font-[650] tracking-[0.01em]">Tailor</h1>
        <p className="mt-1 text-muted text-[0.88rem]">
          Edit a script and explore execution branches, variables, and nested callbacks.
        </p>
      </header>

      {/* Main layout */}
      <section
        className="grid gap-4 flex-1"
        style={{
          gridTemplateColumns: "minmax(300px,36%) 1fr",
          minHeight: "calc(100vh - 130px)",
        }}
      >
        {/* Left column: editor + imports + params */}
        <aside className="flex flex-col gap-3">
          {/* Editor */}
          <div className="rounded-xl border border-border bg-panel overflow-hidden flex flex-col flex-1">
            <div className="px-3.5 py-3 border-b border-border bg-panel-subtle text-[0.7rem] font-bold tracking-[0.08em] uppercase text-muted">
              Script
            </div>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full min-h-[320px] border-0 resize-none outline-none bg-panel text-text p-4 font-mono text-[0.84rem] leading-relaxed"
            />
          </div>

          {/* Imports — shown at root only */}
          {analysis && atRoot && analysis.imports.length > 0 && (
            <ImportsPanel imports={analysis.imports} />
          )}

          {/* Params / inputs */}
          {analysis && analysis.params.length > 0 && (
            <ParamsPanel
              params={analysis.params}
              inputValues={inputValues}
              onChange={handleParamChange}
            />
          )}
        </aside>

        {/* Right column: flow canvas */}
        <section className="rounded-xl border border-border bg-panel overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-border bg-panel-subtle px-3.5 flex-wrap gap-1.5">
            <div className="py-3 text-[0.7rem] font-bold tracking-[0.08em] uppercase text-muted">
              Flow
            </div>
            {analysis && (
              <Breadcrumbs
                fnName={analysis.fnName}
                focusStack={focusStack}
                onReset={() => setFocusStack([])}
                onNavigate={(i) => setFocusStack((prev) => prev.slice(0, i + 1))}
              />
            )}
          </div>

          {/* Parse error */}
          {error && (
            <p className="m-0 px-3.5 py-2.5 text-error border-b border-border text-[0.84rem]">
              Parse error: {error}
            </p>
          )}

          {/* Canvas */}
          <div className="tailor-canvas">
            <ReactFlow fitView nodes={graph.nodes} edges={graph.edges} nodeTypes={nodeTypes}>
              <Controls position="top-right" />
              <Background gap={22} size={1.2} />
            </ReactFlow>
          </div>
        </section>
      </section>
    </main>
  );
}
