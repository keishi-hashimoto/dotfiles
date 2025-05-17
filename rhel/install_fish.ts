import { Logger } from "../utils/logger.ts";
import $ from "../utils/prompt.ts";
import { setDefaultShell } from "../utils/shell.ts";

const logger = new Logger("Install Fish (RHEL)");

const isFishInstalled = async (): Promise<boolean> => {
  const result = await $`which fish`.noThrow();
  const code = result.code;
  logger.debug(`status code of grep command: ${code}`);
  return code === 0;
};

const installFish = async () => {
  logger.info("starting to install fish.");
  await $`sudo dnf install -y fish`;
  logger.info("fish is installed");
};
const setFishAsDefaultShell = async () => {
  const user = Deno.env.get("USER");
  if (user === undefined) {
    const msg = "OS ユーザー名が取得できませんでした";
    logger.error(msg);
    throw new Error(msg);
  }
  logger.info(`set fish as a default shell of user "${user}"`);
  await setDefaultShell(user, "/bin/fish");
  logger.info(`fish is set as a default shell of user "${user}"`);
};

const testFish = async () => {
  logger.info(`test fish`);
  // ~/.config/fish/config.fish を作成するために一度 fish を実行する
  await $`fish -c "echo OK"`;
  logger.info(`fish is tested`);
};

const installFisher = async () => {
  logger.info("starting to install fisher.");
  await $`curl https://git.io/fisher --create-dirs -sLo ~/.config/fish/functions/fisher.fish`;
  logger.info("fisher is installed");
};

const installOhMyFish = async () => {
  logger.info("starting to install oh-my-fish.");
  // ~/.config/fish/config.fish が確実に作成されるように fish を経由する
  await $`fish -c "fisher install oh-my-fish/theme-bobthefish"`;
  logger.info("oh-my-fish is installed");
};

export const setupFish = async () => {
  // fish がインストール済みなら終了
  logger.info("check if fish is already installed.");
  // ベストかは分からないが、とりあえず /etc/shells を見る
  const isInstalled = await isFishInstalled();
  if (isInstalled) {
    logger.info("fish is already installed.");
    return;
  }
  logger.info("fish is not installed.");
  await installFish();
  await setFishAsDefaultShell();
  await testFish();
  await installFisher();
  await installOhMyFish();
};
