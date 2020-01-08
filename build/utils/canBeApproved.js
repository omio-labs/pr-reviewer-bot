"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators");
async function canBeApproved(githubParameters, botConfig) {
    const results = await Promise.all(botConfig.approvalRules.map(async (ruleValidators) => {
        if (ruleValidators.changedFiles) {
            const valid = await validators_1.changedFilesValidator(githubParameters, ruleValidators.changedFiles);
            if (!valid) {
                return false;
            }
        }
        if (ruleValidators.properties) {
            const valid = await validators_1.propertiesValidator(githubParameters, ruleValidators.properties);
            if (!valid) {
                return false;
            }
        }
        if (ruleValidators.versionBump) {
            const valid = await validators_1.versionBumpValidator(githubParameters, ruleValidators.versionBump);
            if (!valid) {
                return false;
            }
        }
        return true;
    }));
    return results.some(Boolean);
}
exports.default = canBeApproved;
