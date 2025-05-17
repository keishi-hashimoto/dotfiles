import { BaseInstaller } from "./index.ts";
import { setupFish } from "../rhel/install_fish.ts";
import { installGit } from "../rhel/install_git.ts";

export class RHELlInstaller extends BaseInstaller {
  override async installFish(): Promise<void> {
    await setupFish();
  }
  override async installGit(): Promise<void> {
    await installGit();
  }
}
