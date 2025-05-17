import { Logger } from "../utils/logger.ts";
import $ from "../utils/prompt.ts";

const logger = new Logger("yum installer")

export const yumInstall = async (pkg: string) => {
    logger.info(`starting install ${pkg}`)
    await $`sudo yum install -y ${pkg}`
    logger.info(`${pkg} is installed`)
}