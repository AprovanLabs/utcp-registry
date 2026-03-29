export type FlowArg = {
  /** The full source text of the argument expression */
  text: string;
  /** All distinct variable names referenced inside this arg expression */
  refVars: string[];
};

export type NestedBlock = {
  label: "then" | "catch" | "finally";
  steps: FlowStep[];
};

export type FlowStep = {
  id: number;
  object: string | null;
  method: string | null;
  description: string | null;
  args: FlowArg[];
  produces: string | null;
  isAwait: boolean;
  nested: NestedBlock[];
  parallel: boolean;
  calls: FlowStep[];
};

export type FlowAnalysis = {
  imports: Array<{ name: string; module: string }>;
  steps: FlowStep[];
  produced: Map<string, number>;
  params: Array<{ name: string }>;
  fnName: string | null;
};

export type FocusView = {
  title: string;
  steps: FlowStep[];
  fromStepId: number | null;
};
