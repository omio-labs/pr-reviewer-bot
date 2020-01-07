import BotConfig from '../../src/types/bot-config';

export const searchFrontend: BotConfig = {
  approvalRules: [
    {
      changedFiles: {
        allowed: ['app/locales', 'package.json', 'yarn.lock'],
      },
      properties: [
        {
          files: ['package.json'],
          allowed: ['translationVersion', 'dependencies', 'devDependencies'],
        },
      ],
      versionBump: {
        packageManager: 'npm',
        versionBumpType: 'minor',
      },
    },
    {
      changedFiles: {
        allowed: ['native-app', 'app-slice'],
      },
    },
  ],
};

export const priceAlert: BotConfig = {
  approvalRules: [],
};
