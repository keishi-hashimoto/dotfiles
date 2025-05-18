import $ from "../utils/prompt.ts";
import { SupportedShell } from "../constants.ts";
import { Logger } from "../utils/logger.ts";
import { activate } from "./utils.ts";

const logPrefix = "install mise";
const logger = new Logger(logPrefix);

const getActivationKeyword = (shell: SupportedShell): string => {
  switch (shell) {
    case "bash":
      return `eval "$(~/.local/bin/mise activate bash)"`;
    case "zsh":
      return `eval "$(~/.local/bin/mise activate zsh)"`;
    case "fish":
      return `~/.local/bin/mise activate fish | source`;
  }
};

const activateMise = async () => {
  await activate(getActivationKeyword);
};

export const installMise = async () => {
  logger.info("Staring to install mise.");
  await $`curl https://mise.run | sh`;
  logger.info("Mise is installed.");
  logger.info("Modify .*rc file to activate mise.");
  await activateMise();
  logger.info("Mise is activated.");
};
