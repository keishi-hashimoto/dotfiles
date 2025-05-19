import { BaseInstaller } from "./index.ts";
import { setupFish } from "../rhel/install_fish.ts";
import { installGit } from "../rhel/install_git.ts";
import { installUtils } from "../rhel/install_utils.ts";
import { installGh } from "../rhel/install_gh.ts";
import { installVim } from "../rhel/install_vim.ts";

export class RHELlInstaller extends BaseInstaller {
  override async installFish(): Promise<void> {
    await setupFish();
  }
  override async installVim(): Promise<void> {
    await installVim();
  }
  override async installGit(): Promise<void> {
    await installGit();
  }
  override async installGh(): Promise<void> {
    await installGh();
  }
  override async installUtils(): Promise<void> {
    await installUtils();
  }
}
