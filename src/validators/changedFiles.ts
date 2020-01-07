import GithubParameters from '../types/github-parameters';
import { getChangedFiles } from '../utils/githubApi';
import { isFilePathAllowed } from '../utils/isPathAllowed';

export interface ChangedFilesValidatorOptions {
  allowed: string[];
  disallowed?: string[];
}

export default async function(githubParams: GithubParameters, options: ChangedFilesValidatorOptions) {
  const changedFiles = await getChangedFiles(githubParams);
  return changedFiles.every(file => isFilePathAllowed(options.allowed, options.disallowed || [], file.filename));
}
