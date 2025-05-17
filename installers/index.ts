import { installMise } from "../common/install_mise.ts";

export class BaseInstaller {
  async install() {
    await this.installFish();
    await this.installMise();
  }

  async installFish() {
  }

  async installMise() {
    await installMise();
  }
}
