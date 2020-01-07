import { getChangedFiles, getObjectFileDiff } from '../utils/githubApi';
import isVersionAllowed from '../utils/isVersionAllowed';
import GithubParameters from '../types/github-parameters';

const defaultPackageManagerProperties = {
  npm: ['dependencies', 'devDependencies', 'peerDependencies'],
};

export type VersionBumpType = 'major' | 'minor' | 'patch';

export interface VersionBumpValidatorOptions {
  packageManager: 'npm';
  versionBumpType: VersionBumpType;
  properties?: string[];
}

export default async function(githubParams: GithubParameters, options: VersionBumpValidatorOptions): Promise<boolean> {
  const changedFiles = (await getChangedFiles(githubParams)).map(file => file.filename);

  if (changedFiles.indexOf('package.json') === -1) {
    return true;
  }

  const changedItems = await getObjectFileDiff(githubParams, 'package.json');
  const properties = options.properties || defaultPackageManagerProperties[options.packageManager];

  // Check dependency versions
  return changedItems
    .filter(({ keyPath }) => {
      return properties.some(propertyName => keyPath.startsWith(`${propertyName}`));
    })
    .every(({ newValue, prevValue }) => {
      return isVersionAllowed(options.versionBumpType, prevValue, newValue);
    });
}
