export interface CommandOptions {
  command: string;
  _unknown: string[];
}

export interface InstallCommandOptions {
  packageNames: string[];
  _unknown: string[];
}

export interface UninstallCommandOptions {
  packageNames: string[];
  _unknown: string[];
}

export interface SearchCommandOptions {
  searchTerm: string;
  _unknown: string[];
}

export interface ListCommandOptions {
  repo: boolean;
  installed: boolean;
  _unknown: string[];
}

export interface UpdateCommandOptions {
  force: boolean;
  _unknown: string[];
}

export interface RepoCommandOptions {
  command: string;
  _unknown: string[];
}

export interface RepoModifyCommandOptions {
  repos: string[];
  _unknown: string;
}

export interface Command {
  trigger: string;
  alias: string;
  usage: string;
  run: (argv: string[]) => void;
}

export interface PackageInformation {
  repo: string;
}
