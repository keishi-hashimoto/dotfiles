import $ from "./prompt.ts";
import * as path from "jsr:@std/path";

import { Logger } from "./logger.ts";

const logger = new Logger("utils");

export const getCurrentShell = async (): Promise<string> => {
  const shellAbspath = await $`printenv SHELL`.text("stdout");
  return path.basename(shellAbspath);
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
