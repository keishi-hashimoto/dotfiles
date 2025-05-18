import $ from "./prompt.ts";
import * as path from "jsr:@std/path";

import { Logger } from "./logger.ts";
import { shells, SupportedShell } from "../constants.ts";

const logger = new Logger("utils");

export const getCurrentShell = async (): Promise<SupportedShell> => {
  const shellAbspath = await $`printenv SHELL`.text("stdout");
  const shell = path.basename(shellAbspath);
  if (!shells.some((s) => s === shell)) {
    const msg = `shell "${shell}" is not supported.`;
    throw new Error(msg);
  }
  return shell as SupportedShell;
};

export const isWritten = async (
  file: string,
  keyword: string,
): Promise<boolean> => {
  // grep はキーワードが見つからなかった場合に異常終了するので noThrow で回避する
  const result = await $`grep ${keyword} ${file}`.noThrow();
  const code = result.code;
  logger.debug(`return code of grep command: ${result.code}`);
  return code === 0;
};

export const setDefaultShell = async (user: string, shellPath: string) => {
  await $`sudo usermod ${user} -s ${shellPath}`;
};

export const getShellConfigFile = (shell: SupportedShell) => {
  const homeDir = Deno.env.get("HOME");
  switch (shell) {
    case "bash":
      return `${homeDir}/.bashrc`;
    case "zsh":
      return `${homeDir}/.zshrc`;
    case "fish":
      return `${homeDir}/.config/fish/config.fish`;
  }
};

const expandHomeDir = (file: string): string => {
  if (!file.includes("~")) return file;

  const homeDir = Deno.env.get("HOME");
  if (homeDir === undefined) {
    const msg = "ホームディレクトリが特定できませんでした";
    logger.error(msg);
    throw new Error(msg);
  }
  return file.replace("~", homeDir);
};

export const patchCofigFile = async (file: string, newText: string) => {
  logger.info(`patch file ${file}.`);
  file = expandHomeDir(file);
  if (await $.path(file).exists()) {
    const backupFile = `${file}.bak`;
    await $.path(file).copy(backupFile, { overwrite: true });
  }

  $.path(file).writeTextSync(newText);
  logger.info(`file ${file} is patched.`);
};
