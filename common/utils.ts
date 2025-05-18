import { CommandBuilder } from "@david/dax";

import $ from "../utils/prompt.ts";
import type { MultiSelectOption } from "@david/dax";
import { Logger } from "../utils/logger.ts";

import { shells } from "../constants.ts";
import {
  getCurrentShell,
  getShellConfigFile,
  isWritten,
} from "../utils/shell.ts";
import type { SupportedShell } from "../constants.ts";

const logger = new Logger("utils (common)");

export const isInstalled = async (pkg: string): Promise<boolean> => {
  logger.debug(`check if ${pkg} is installed.`);
  const result = await $`which ${pkg}`.noThrow();
  const installed = result.code === 0;
  if (installed) {
    logger.debug(`${pkg} is already installed.`);
  } else {
    logger.debug(`${pkg} is not yet installed.`);
  }
  return installed;
};

const getTargetShellCandidates = (
  curerntShell: SupportedShell,
): MultiSelectOption[] => {
  return shells.map((s) => {
    return { text: s, selected: s === curerntShell };
  });
};

export const getTargetShells = async (): Promise<SupportedShell[]> => {
  const curerntShell = await getCurrentShell();
  const targetShellCandidates = getTargetShellCandidates(curerntShell);
  const targetShellsIdx = await $.multiSelect({
    message:
      `In which shells to activate. (current shell "${curerntShell}" is selected by default.)`,
    options: targetShellCandidates,
    noClear: true,
  });
  const targetShells = targetShellCandidates.filter((_, idx) =>
    targetShellsIdx.includes(idx)
  ).map((s) => s.text);
  logger.info(`Following shells are selected: ${targetShells}`);
  return targetShells as SupportedShell[];
};

export const activate = async (
  getActivationKeywordFunc: (shell: SupportedShell) => string,
) => {
  const targetShells = await getTargetShells();
  for (const shell of targetShells) {
    const file = getShellConfigFile(shell);
    const keyword = getActivationKeywordFunc(shell);
    logger.info(
      `check if activation keyword (${keyword}) is already written in file (${file})`,
    );
    // 後続の noThrow で全てのエラーが無視されるので、ファイルの有無は事前に確認しておく
    const isExists = await $.path(file).exists();
    if (isExists) {
      const _isWritten = await isWritten(file, keyword);
      if (_isWritten) {
        logger.info(
          `activation keyword ${keyword} is already written in file ${file}.`,
        );
        continue;
      }
    }
    logger.info(`write activation keyword "${keyword}" to file ${file}.`);
    // .rc ファイルが確実に存在するように、当該のシェルを経由させる
    // 以下のやり方だと bash -c "echo "keyword" >> ~/.bashrc" のようになり "" が足りないので、CommandBuilder を使う
    // await $`${shell} -c "echo ${keyword} >> ${$.path(file)}"`;
    await new CommandBuilder().command([
      shell,
      "-c",
      `echo "${keyword}" >> ${file}`,
    ]);
    logger.info(`activation keyword is added to file ${file}.`);
  }
};
