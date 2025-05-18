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

export const yumInstall = async (
  pkg: string,
  checkIfInstalled: boolean = true,
) => {
  logger.info(`starting install ${pkg}`);
  if (checkIfInstalled) {
    const _isInstalled = await isInstalled(pkg);
    if (_isInstalled) {
      logger.info(`${pkg} is already installed.`);
      return;
    }
  }
  await $`sudo yum install -y ${pkg}`;
  logger.info(`${pkg} is installed`);
};

export const yumInstallMulti = async (pkgs: string[]) => {
  // チェックが煩雑になる && 一つでも未インストールがあれば結局同じことなのでインストール済みかは確認しない
  logger.info(`starting install ${pkgs}`);
  await $`sudo yum install -y ${pkgs}`;
  logger.info(`${pkgs} is installed`);
};
