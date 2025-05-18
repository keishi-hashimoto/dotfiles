import { installMise } from "../common/install_mise.ts";
import { type Options } from "./options.ts";
import { installZ } from "../common/install_z.ts";

export class BaseInstaller {
  #options: Options;
  constructor(options: Options) {
    this.#options = options;
  }
  async install() {
    const options = this.#options;
    if (options.git) await this.installGit();
    if (options.gh) await this.installGh();
    if (options.fish) await this.installFish();
    if (options.mise) await this.installMise();
    if (options.z) await this.installZ();
    if (options.utils) await this.installUtils();
  }

  async installFish() {
  }

  async installMise() {
    await installMise();
  }

  async installGit() {}
  async installGh() {}
  async installZ() {
    await installZ();
  }
  async installUtils() {}
}
