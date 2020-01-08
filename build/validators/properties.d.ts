import GithubParameters from '../types/github-parameters';
interface PropertiesOptions {
    files: string[];
    allowed: string[];
    disallowed?: string[];
}
export declare type PropertiesValidatorOptions = PropertiesOptions[];
export default function (githubParams: GithubParameters, optionsList: PropertiesValidatorOptions): Promise<boolean>;
export {};
