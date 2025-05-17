import { Logger } from "../utils/logger.ts";
import $ from "../utils/prompt.ts";

const logger = new Logger("yum installer");

const isInstalled = async (pkg: string): Promise<boolean> => {
  logger.debug(`check if ${pkg} is installed.`);
  // yum list は結果無しの場合に status=1 を返す
  // list installed のみであれば sudo 不要
  const result = await $`yum list installed ${pkg}`.noThrow();
  const code = result.code;
  logger.debug(`code: ${code}`);
  return code === 0;
};

export const yumInstall = async (pkg: string) => {
  logger.info(`starting install ${pkg}`);
  const _isInstalled = await isInstalled(pkg);
  if (_isInstalled) {
    logger.info(`${pkg} is already installed.`);
    return;
  }
  await $`sudo yum install -y ${pkg}`;
  logger.info(`${pkg} is installed`);
};
