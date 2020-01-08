import GithubParameters from '../types/github-parameters';
export declare type VersionBumpType = 'major' | 'minor' | 'patch';
export interface VersionBumpValidatorOptions {
    packageManager: 'npm';
    versionBumpType: VersionBumpType;
    properties?: string[];
}
export default function (githubParams: GithubParameters, options: VersionBumpValidatorOptions): Promise<boolean>;
