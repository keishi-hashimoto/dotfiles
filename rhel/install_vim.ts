import { Logger } from "../utils/logger.ts";
import { yumInstall } from "./utils.ts";
import { text } from "../configs/.vimrc.ts";
import { patchCofigFile } from "../utils/shell.ts";

const logger = new Logger("install vim (RHEL)");

const file = "~/.vimrc";
const newText = text;

const _installVim = async () => {
  logger.info("starting to install vim.");
  await yumInstall("vim");
  logger.info("vim is installed.");
};

const configureVimrc = async () => {
  logger.info(`configure ${file}`);
  await patchCofigFile(file, newText);
  logger.info(`${file} is configured.`);
};

export const installVim = async () => {
  await _installVim();
  await configureVimrc();
};
