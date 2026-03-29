type ImportsPanelProps = {
  imports: Array<{ name: string; module: string }>;
};

export function ImportsPanel({ imports }: ImportsPanelProps) {
  if (imports.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-panel overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-border bg-panel-subtle text-[0.7rem] font-bold tracking-[0.08em] uppercase text-muted">
        Imports
      </div>
      <div className="divide-y divide-border">
        {imports.map(({ name, module }) => (
          <div key={name} className="flex items-center gap-2 px-3.5 py-2 font-mono text-[0.78rem]">
            <span className="text-provider-text font-bold">import</span>
            <span className="inline-flex items-center rounded-full border border-provider-border bg-provider-bg text-provider-text px-2 py-0.5 text-[0.68rem] font-bold">
              {name}
            </span>
            <span className="text-muted">from</span>
            <span className="text-neutral-500">'{module}'</span>
          </div>
        ))}
      </div>
    </div>
  );
}
