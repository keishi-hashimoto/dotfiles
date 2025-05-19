import $ from "../utils/prompt.ts";
import { Logger } from "../utils/logger.ts";
import { defaultBranch } from "../constants.ts";

const logger = new Logger("Configure Git");

const setDefaultBranch = async () => {
  logger.info("set default branch as main.");
  await $`git config --global init.defaultBranch ${defaultBranch}`;
  logger.info("default branch is set.");
};

const getGitUsername = async (): Promise<string> => {
  logger.debug("check git username.");
  // 当該項目が未設定なら status = 1
  const username = await $`git config user.name`.noThrow().text();
  if (username) {
    logger.debug(`username: ${username}`);
  } else {
    logger.info("username is empty.");
  }
  return username;
};

const getGitEmail = async (): Promise<string> => {
  logger.debug("check git email.");
  // 当該項目が未設定なら status = 1
  const email = await $`git config user.email`.noThrow().text();
  if (email) {
    logger.debug(`email: ${email}`);
  } else {
    logger.info("email is empty.");
  }
  return email;
};

const _readGitUsername = async (current: string): Promise<string> => {
  const username = await $.prompt("enter your git username", {
    default: current,
    noClear: true,
  });
  return username;
};

const readGitUsername = async (current: string): Promise<string> => {
  while (true) {
    const username = await _readGitUsername(current);
    if (username) {
      return username;
    }
    logger.warning("username can't be empty");
  }
};

const _readGitEmail = async (current: string): Promise<string> => {
  const username = await $.prompt("enter your git email", {
    default: current,
    noClear: true,
  });
  return username;
};

const readGitEmail = async (current: string): Promise<string> => {
  while (true) {
    const username = await _readGitEmail(current);
    if (username) {
      return username;
    }
    logger.warning("email can't be empty");
  }
};

const setGitUsername = async () => {
  logger.info("set git username.");
  const currentUsername = await getGitUsername();
  if (currentUsername) {
    const overwrite = await $.confirm(
      `your current git username is ${currentUsername}. will you overwrite this?`,
      { default: false, noClear: true },
    );
    if (!overwrite) {
      return;
    }
  }
  const username = await readGitUsername(currentUsername);
  logger.info(`set git username as ${username}.`);
  await $`git config --global user.name ${username}`;
  logger.info("git username is set.");
};

const setGitEmail = async () => {
  logger.info("set git email.");

  const currentEmail = await getGitEmail();
  if (currentEmail) {
    const overwrite = await $.confirm(
      `your current git email is ${currentEmail}. will you overwrite this?`,
      { default: false, noClear: true },
    );
    if (!overwrite) {
      return;
    }
  }

  const email = await readGitEmail(currentEmail);
  logger.info(`set git email as ${email}.`);
  await $`git config --global user.email ${email}`;
  logger.info("git email is set.");
};

export const configureGit = async () => {
  await setDefaultBranch();
  await setGitUsername();
  await setGitEmail();
};
