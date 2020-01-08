import { ChangedFilesValidatorOptions } from '../validators/changedFiles';
import { PropertiesValidatorOptions } from '../validators/properties';
import { VersionBumpValidatorOptions } from '../validators/versionBump';
export interface RuleValidators {
    changedFiles?: ChangedFilesValidatorOptions;
    properties?: PropertiesValidatorOptions;
    versionBump?: VersionBumpValidatorOptions;
}
export default interface BotConfig {
    approvalRules: RuleValidators[];
}
