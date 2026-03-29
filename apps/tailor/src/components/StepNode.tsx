import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { ArgChip, StepNodeData } from "../lib/node-types";

const branchCls = "text-block-text border-block-border bg-block-bg";

const argRelationCls: Record<"local" | "outer" | "input", string> = {
  local: "text-var-text border-var-border bg-var-bg",
  outer: "text-var-outer-text border-var-outer-border bg-var-outer-bg",
  input: "text-var-input-text border-var-input-border bg-var-input-bg",
};

function ArgBadge({ chip }: { chip: ArgChip }) {
  const base =
    "inline-flex gap-1 items-center rounded border px-1.5 py-0.5 font-mono text-[0.7rem]";
  const relCls = chip.relation
    ? argRelationCls[chip.relation]
    : "border-neutral-300 bg-neutral-50 text-text";

  let badge: React.ReactNode = null;
  if (chip.relation === "local" && chip.stepIndex != null) {
    badge = (
      <em className="not-italic text-neutral-500 text-[0.62rem]">
        ← step {chip.stepIndex}
      </em>
    );
  } else if (chip.relation === "input") {
    badge = (
      <em className="not-italic text-[0.62rem]">
        {chip.inputValue != null && chip.inputValue !== ""
          ? JSON.stringify(chip.inputValue)
          : "← input"}
      </em>
    );
  } else if (chip.relation === "outer") {
    badge = <em className="not-italic text-[0.62rem]">← outer</em>;
  }

  return (
    <span className={`${base} ${relCls}`}>
      {chip.text}
      {badge}
    </span>
  );
}

export function StepNode({ data }: NodeProps<Node<StepNodeData>>) {
  return (
    <div
      className={[
        "min-w-[290px] max-w-[360px] rounded-xl border border-border border-l-[3px] border-l-accent",
        "bg-panel text-text p-[0.7rem] shadow-sm",
        data.active ? "ring-1 ring-inset ring-accent" : "",
      ].join(" ")}
    >
      <Handle type="target" position={Position.Top} />

      {/* Header */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {data.isAwait && (
          <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.58rem] font-bold tracking-widest uppercase text-block-text border border-block-border bg-block-bg">
            async
          </span>
        )}
        {data.object && (
          <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.58rem] font-bold tracking-widest uppercase text-provider-text border border-provider-border bg-provider-bg">
            {data.object}
          </span>
        )}
        <span className="font-mono text-[0.84rem] font-bold">{data.method ?? "call"}</span>
      </div>

      {/* Description */}
      {data.description && (
        <p className="mt-2 pl-[0.45rem] border-l-2 border-neutral-300 text-neutral-600 text-[0.75rem] leading-snug">
          {data.description}
        </p>
      )}

      {/* Args */}
      {data.args.length > 0 && (
        <div className="mt-2 flex gap-1.5 flex-wrap">
          {data.args.map((chip, i) => (
            <ArgBadge key={`${chip.text}-${i}`} chip={chip} />
          ))}
        </div>
      )}

      {/* Produces */}
      {data.produces && (
        <div className="mt-2 pt-2 border-t border-border font-mono text-[0.72rem] text-neutral-800">
          returns{" "}
          <span className="inline-flex items-center rounded-full border border-var-border bg-var-bg text-var-text px-2 py-0.5 text-[0.68rem] ml-1">
            {data.produces}
          </span>
        </div>
      )}

      {/* Branch buttons */}
      {data.nested.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border flex gap-1.5 flex-wrap">
          {data.nested.map((branch) => (
            <button
              key={branch.label}
              type="button"
              onClick={() => data.onOpen(branch.label)}
              className={`rounded border px-1.5 py-0.5 text-[0.62rem] font-bold tracking-wider uppercase cursor-pointer ${branchCls}`}
            >
              {branch.label} · {branch.count}
            </button>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
