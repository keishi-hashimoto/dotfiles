import $ from "../utils/prompt.ts";
import { Logger } from "../utils/logger.ts";
import { addRepo, yumInstall } from "./utils.ts";

const logger = new Logger("install gh (RHEL)");

const _installGh = async () => {
  await yumInstall("dnf-command(config-manager)", false);
  await addRepo("https://cli.github.com/packages/rpm/gh-cli.repo");
  await yumInstall("gh", true, "--repo gh-cli");
};

const setupGhEditor = async () => {
  const ghEditor = await $.prompt(
    "which editor will you use at gh command.",
    { default: "vim" },
  );
  logger.debug(`${ghEditor} will be used.`);
  await $`gh config set editor ${ghEditor}`;
};

const ghAuthLogin = async () => {
  await $`gh auth login`;
};

const setupGh = async () => {
  await setupGhEditor();
  await ghAuthLogin();
};

export const installGh = async () => {
  logger.info("starting to install gh.");
  await _installGh();
  logger.info("gh is installed.");
  logger.info("setup gh.");
  await setupGh();
  logger.info("gh is set up.");
};
