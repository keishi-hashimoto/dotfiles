import { Logger } from "../utils/logger.ts";
import $ from "../utils/prompt.ts";
import { activate, isInstalled } from "./utils.ts";
import type { SupportedShell } from "../constants.ts";

const logger = new Logger("install z");

const _installZ = async () => {
  logger.info("starting to install z.");
  await $`curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh`;
  logger.info("z is installed");
};

const getActivationKeyword = (shell: SupportedShell): string => {
  switch (shell) {
    case "bash":
      return `eval "$(zoxide init bash)"`;
    case "zsh":
      return `eval "$(zoxide init zsh)"`;
    case "fish":
      return `zoxide init fish | source`;
  }
};

export const installZ = async () => {
  const isZInstalled = await isInstalled("z");
  if (isZInstalled) {
    logger.info(`skip to installed z since z is already installed.`);
    return;
  }
  await _installZ();
  await activate(getActivationKeyword);
};
