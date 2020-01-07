import canBeApproved from './utils/canBeApproved';
import loadBotConfig from './utils/loadBotConfig';
import { approvePR, getLatestApprovalFromBot, dismissPRApproval, assignAuthorizationToken } from './utils/githubApi';
import messages from './config/messages.json';

import BotOptions from './types/github-parameters';
import { Logger } from './types/logger';

export default async function main(botOptions: BotOptions, logger: Logger = console) {
  assignAuthorizationToken(botOptions.GITHUB_TOKEN);

  const botConfig = loadBotConfig();
  const reviewId = await getLatestApprovalFromBot(botOptions);

  if (await canBeApproved(botOptions, botConfig)) {
    if (!reviewId) {
      await approvePR(botOptions);
      logger.info(messages.SUCCESSFULLY_APPROVED);
    } else {
      logger.info(messages.ALREADY_APPROVED);
    }
  } else if (reviewId) {
    await dismissPRApproval(botOptions, reviewId);
    logger.info(messages.APPROVAL_DISMISSED);
  } else {
    logger.info(messages.NOT_ELIGIBLE);
  }
}
