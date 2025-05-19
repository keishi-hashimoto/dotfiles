export const shells = [
  "bash",
  "zsh",
  "fish",
] as const;

export type SupportedShell = (typeof shells)[number];

export const defaultBranch = "main";

export const utilities = ["fzf", "bat"];
