import GithubParameters from '../types/github-parameters';
export interface ChangedFilesValidatorOptions {
    allowed: string[];
    disallowed?: string[];
}
export default function (githubParams: GithubParameters, options: ChangedFilesValidatorOptions): Promise<boolean>;
