#!/usr/bin/env -S deno run -A

import { RHELlInstaller } from "./installers/rhel_installer.ts";
import { getPlatform } from "./utils/platforms.ts";
import { Command } from "@cliffy/command";
import { OptionKeys, type Options } from "./installers/options.ts";
import $ from "./utils/prompt.ts";

const allNoOptions: Options = {
  fish: false,
  git: false,
  mise: false,
};

const allYesOptions: Options = Object.assign(
  {},
  ...Object.keys(allNoOptions).map((key) => {
    return { [key]: true };
  }),
);

const optionKeys: OptionKeys[] = ["fish", "git", "mise"];

const askEachInstallOption = async (key: OptionKeys): Promise<boolean> => {
  const doInstall = await $.confirm(
    `install ${key} or not`,
    { default: false },
  );
  return doInstall;
};

const askInstallOptions = async (): Promise<Options> => {
  const options = allNoOptions;
  for (const key of optionKeys) {
    const doInstall = await askEachInstallOption(key);
    if (doInstall) {
      options[key] = doInstall;
    }
  }
  return options;
};

const runInstaller = async (options: Options) => {
  const platform = await getPlatform();
  switch (platform) {
    case "RHEL": {
      const installer = new RHELlInstaller(options);
      await installer.install();
      break;
    }
    case "Ubuntu":
      //
      break;
  }
};

const cmd = new Command()
  .name("installer")
  .option("-a, --all", "run installer of all targets.", { default: false })
  .action(async ({ all }: { all: boolean }) => {
    let options: Options = allYesOptions;
    if (!all) {
      options = await askInstallOptions();
    }
    console.log(`options: ${options}`);
    await runInstaller(options);
  });

cmd.parse(Deno.args);
