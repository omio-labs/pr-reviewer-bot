import BotConfig from '../types/bot-config';
import GithubParameters from '../types/github-parameters';
export default function canBeApproved(githubParameters: GithubParameters, botConfig: BotConfig): Promise<boolean>;
