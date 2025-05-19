import { Logger } from "./logger.ts";
import $ from "./prompt.ts";
import { isWritten } from "./shell.ts";

export type Platform = "RHEL" | "Ubuntu";

const logger = new Logger("utils");

export const getPlatform = async (): Promise<Platform> => {
  logger.info("checking current platform.");
  const isRHEL = await $.path("/etc/redhat-release").exists();
  if (isRHEL) {
    logger.info("current platform is RHEL");
    return "RHEL";
  }
  try {
    const isUbuntu = await isWritten("/etc/os-release", "ID=ubuntu");
    if (isUbuntu) {
      logger.info("current platform is Ubuntu");
      return "Ubuntu";
    }
  } catch (e) {
    const msg = `failed to get OS (${e})`;
    logger.error(msg);
    throw new Error(msg);
  }
  const msg =
    `Invalid OS. Only RHEL and Ubuntu is supported in this installer.`;
  logger.error(msg);
  throw new Error(msg);
};
