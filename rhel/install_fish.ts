import { Logger } from "../utils/logger.ts";
import $ from "../utils/prompt.ts";
import { setDefaultShell } from "../utils/shell.ts";
import { yumInstall } from "./utils.ts";
import { getCurrentShell } from "../utils/shell.ts";

const logger = new Logger("Install Fish (RHEL)");

const installFish = async () => {
  await yumInstall("fish");
};
const setFishAsDefaultShell = async () => {
  const currentShell = await getCurrentShell();
  if (currentShell === "fish") {
    logger.info("fish is already set as default shell.");
    return;
  }
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
  await installFish();
  await setFishAsDefaultShell();
  await testFish();
  await installFisher();
  await installOhMyFish();
};
