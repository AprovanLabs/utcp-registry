import type { FocusView } from "../lib/types";

type BreadcrumbsProps = {
  fnName: string | null;
  focusStack: FocusView[];
  onReset: () => void;
  onNavigate: (index: number) => void;
};

export function Breadcrumbs({ fnName, focusStack, onReset, onNavigate }: BreadcrumbsProps) {
  const rootLabel = fnName ? `${fnName}( )` : "root";

  const pill = (active: boolean) =>
    [
      "rounded-full border px-2 py-0.5 text-[0.67rem] font-bold tracking-wider uppercase cursor-pointer transition-colors",
      active
        ? "border-accent text-accent bg-neutral-100"
        : "border-border text-muted bg-panel hover:border-neutral-400",
    ].join(" ");

  return (
    <div className="flex gap-1.5 flex-wrap items-center py-1 px-0.5">
      <button type="button" onClick={onReset} className={pill(focusStack.length === 0)}>
        {rootLabel}
      </button>
      {focusStack.map((view, index) => (
        <button
          key={`${view.title}-${index}`}
          type="button"
          className={pill(index === focusStack.length - 1)}
          onClick={() => onNavigate(index)}
        >
          {view.title}
        </button>
      ))}
    </div>
  );
}
