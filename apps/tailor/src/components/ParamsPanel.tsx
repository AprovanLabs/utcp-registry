type ParamsPanelProps = {
  params: Array<{ name: string }>;
  inputValues: Map<string, string>;
  onChange: (name: string, value: string) => void;
};

export function ParamsPanel({ params, inputValues, onChange }: ParamsPanelProps) {
  if (params.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-panel overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-border bg-panel-subtle text-[0.7rem] font-bold tracking-[0.08em] uppercase text-muted">
        Inputs
      </div>
      <div className="divide-y divide-border">
        {params.map(({ name }) => (
          <div key={name} className="flex items-center gap-2.5 px-3.5 py-2">
            <label
              htmlFor={`param-${name}`}
              className="font-mono text-[0.78rem] font-bold text-var-input-text min-w-[4.5rem] flex-shrink-0"
            >
              {name}
            </label>
            <input
              id={`param-${name}`}
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={inputValues.get(name) ?? ""}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder={`value for ${name}…`}
              className="flex-1 bg-panel-subtle border border-border rounded-md px-2 py-1 font-mono text-[0.78rem] text-text outline-none placeholder:text-neutral-400 focus:border-neutral-400 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
