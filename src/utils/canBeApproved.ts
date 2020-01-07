import BotConfig from '../types/bot-config';
import GithubParameters from '../types/github-parameters';
import { changedFilesValidator, versionBumpValidator, propertiesValidator } from '../validators';

export default async function canBeApproved(githubParameters: GithubParameters, botConfig: BotConfig): Promise<boolean> {
  const results = await Promise.all(
    botConfig.approvalRules.map(async ruleValidators => {
      if (ruleValidators.changedFiles) {
        const valid = await changedFilesValidator(githubParameters, ruleValidators.changedFiles);
        if (!valid) {
          return false;
        }
      }

      if (ruleValidators.properties) {
        const valid = await propertiesValidator(githubParameters, ruleValidators.properties);
        if (!valid) {
          return false;
        }
      }

      if (ruleValidators.versionBump) {
        const valid = await versionBumpValidator(githubParameters, ruleValidators.versionBump);
        if (!valid) {
          return false;
        }
      }

      return true;
    }),
  );

  return results.some(Boolean);
}
