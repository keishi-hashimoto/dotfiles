import { BaseInstaller } from "./index.ts";
import { setupFish } from "../rhel/install_fish.ts";

export class RHELlInstaller extends BaseInstaller {
  override async installFish(): Promise<void> {
    await setupFish();
  }
}
