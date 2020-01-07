import * as fs from 'fs';
import * as yaml from 'js-yaml';
import BotConfig from '../types/bot-config';

const BOT_CONFIG_FILE_NAMES = ['.pr-bot.json', '.pr-bot.yml'];

export default function(): BotConfig {
  const botFileName = BOT_CONFIG_FILE_NAMES.find(fileName => fs.existsSync(fileName));

  if (!botFileName) {
    throw new Error('Bot config not found.');
  }

  const fileContent = fs.readFileSync(botFileName, 'utf8');
  return botFileName.endsWith('.yml') ? yaml.safeLoad(fileContent) : JSON.parse(fileContent);
}
