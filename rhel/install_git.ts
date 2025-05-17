import { configureGit } from "../common/configure_git.ts";
import { yumInstall } from "./utils.ts";

export const installGit = async () => {
  await yumInstall("git");
  await configureGit();
};
