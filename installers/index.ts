import { installMise } from "../common/install_mise.ts";
import { type Options } from "./options.ts";

export class BaseInstaller {
  #options: Options;
  constructor(options: Options) {
    this.#options = options;
  }
  async install() {
    const options = this.#options;
    if (options.git) await this.installGit();
    if (options.fish) await this.installFish();
    if (options.mise) await this.installMise();
  }

  async installFish() {
  }

  async installMise() {
    await installMise();
  }

  async installGit() {}
}
