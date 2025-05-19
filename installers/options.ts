export type Options = {
  fish: boolean;
  vim: boolean;
  git: boolean;
  gh: boolean;
  mise: boolean;
  z: boolean;
  utils: boolean;
};

export type OptionKeys = keyof Options;
