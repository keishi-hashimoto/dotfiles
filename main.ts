#!/usr/bin/env -S deno run -A

import { RHELlInstaller } from "./installers/rhel_installer.ts";
import { getPlatform } from "./utils/platforms.ts";

const runInstaller = async () => {
  const platform = await getPlatform();
  switch (platform) {
    case "RHEL": {
      const installer = new RHELlInstaller();
      await installer.install();
      break;
    }
    case "Ubuntu":
      //
      break;
  }
};

await runInstaller();
