import { utilities } from "../constants.ts";
import { Logger } from "../utils/logger.ts";
import { yumInstall, yumInstallMulti } from "./utils.ts";

const logger = new Logger("install utils (RHEL)");

export const installUtils = async () => {
  logger.info("install utilities.");
  await yumInstall("epel-release");
  await yumInstallMulti(utilities);
  logger.info("utilities are installed.");
};
