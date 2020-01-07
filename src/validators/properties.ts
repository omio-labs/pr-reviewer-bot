import { getChangedFiles, getObjectFileDiff } from '../utils/githubApi';
import { matchesPath, isPropertyPathAllowed } from '../utils/isPathAllowed';
import GithubParameters from '../types/github-parameters';

interface PropertiesOptions {
  files: string[];
  allowed: string[];
  disallowed?: string[];
}

export type PropertiesValidatorOptions = PropertiesOptions[];

const filterMatchingFiles = (changedFiles: string[], path: string) => changedFiles.filter(fileName => matchesPath(path, fileName, '/'));

// Iterates over an array with a function that returns a Promise<boolean>
// then applies `.every` on the results
async function everyPromise<T>(items: T[], iterator: (item: T) => Promise<boolean>) {
  const promises = items.map(iterator);
  const results = await Promise.all(promises);
  return results.every(Boolean);
}

async function isPropertyChangeAllowed(githubParams: GithubParameters, objectFileName: string, options: PropertiesOptions): Promise<boolean> {
  const changedItems = await getObjectFileDiff(githubParams, objectFileName);
  const { allowed, disallowed } = options;

  return changedItems.every(({ keyPath }) => isPropertyPathAllowed(allowed, disallowed || [], keyPath));
}

export default async function(githubParams: GithubParameters, optionsList: PropertiesValidatorOptions): Promise<boolean> {
  const changedFiles = (await getChangedFiles(githubParams)).map(file => file.filename);

  return everyPromise(optionsList, async options => {
    return everyPromise(options.files, async filePath => {
      const matchingFiles = filterMatchingFiles(changedFiles, filePath);

      return everyPromise(matchingFiles, fileName => isPropertyChangeAllowed(githubParams, fileName, options));
    });
  });
}
