export type ArgChip = {
  text: string;
  /** null = plain literal, otherwise what kind of reference */
  relation: "local" | "outer" | "input" | null;
  /** step index (1-based) when relation === "local" */
  stepIndex?: number;
  /** live value when relation === "input" and user has typed something */
  inputValue?: string;
};

export type StepNodeData = {
  title: string;
  object: string | null;
  method: string | null;
  description: string | null;
  isAwait: boolean;
  produces: string | null;
  args: ArgChip[];
  nested: Array<{ label: "then" | "catch" | "finally"; count: number }>;
  onOpen: (label: "then" | "catch" | "finally") => void;
  active: boolean;
};

export type ParallelNodeData = {
  title: string;
  description: string | null;
  calls: Array<{
    name: string;
    description: string | null;
    args: ArgChip[];
    nested: Array<{ label: "then" | "catch" | "finally"; count: number }>;
  }>;
  onOpenCallBranch: (callIndex: number, label: "then" | "catch" | "finally") => void;
  active: boolean;
};
