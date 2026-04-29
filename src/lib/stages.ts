export interface Stage {
  id: string;
  num: string;
  label: string;
  hint: string;
}

export const stages: readonly Stage[] = [
  { id: "source", num: "01", label: "Source", hint: "code is written" },
  { id: "deps", num: "02", label: "Dependencies", hint: "code is borrowed" },
  { id: "build", num: "03", label: "Build", hint: "code becomes artifact" },
  { id: "publish", num: "04", label: "Publish", hint: "artifact gets a name" },
  { id: "distribute", num: "05", label: "Distribute", hint: "name is resolved" },
  { id: "consume", num: "06", label: "Consume", hint: "artifact runs" },
] as const;
