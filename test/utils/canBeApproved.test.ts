import canBeApproved from '../../src/utils/canBeApproved';
import { getChangedFiles, getObjectFileDiff } from '../../src/utils/githubApi';
import { changedFiles1, translationFiles } from '../mocks/changedFiles';
import { minorBumpsDiff, majorBumpsDiff } from '../mocks/packageJsonMocks';
import BotConfig, { RuleValidators } from '../../src/types/bot-config';
import mockGithubParameters from '../mocks/mockGithubParameters';

jest.mock('../../src/utils/githubApi');
(getChangedFiles as jest.Mock).mockResolvedValue(changedFiles1);
(getObjectFileDiff as jest.Mock).mockResolvedValue(minorBumpsDiff);

describe('canBeApproved()', () => {
  it('should approve whitelisted files', async () => {
    expect(
      await canBeApproved(mockGithubParameters, {
        approvalRules: [
          {
            changedFiles: {
              allowed: ['package.json', 'package-lock.json'],
            },
            properties: [
              {
                allowed: ['dependencies', 'devDependencies'],
                files: ['package.json'],
              },
            ],
            versionBump: {
              packageManager: 'npm',
              versionBumpType: 'minor',
            },
          },
        ],
      }),
    ).toBe(true);
  });

  it('should not approve non-whitelisted files', async () => {
    expect(
      await canBeApproved(mockGithubParameters, {
        approvalRules: [
          {
            changedFiles: {
              allowed: ['package.json', 'yarn.lock'],
            },
            properties: [
              {
                allowed: ['dependencies', 'devDependencies'],
                files: ['package.json'],
              },
            ],
            versionBump: {
              packageManager: 'npm',
              versionBumpType: 'minor',
            },
          },
        ],
      }),
    ).toBe(false);
  });

  it('should reject when version bump not allowed', async () => {
    const rule: RuleValidators = {
      changedFiles: {
        allowed: ['package.json', 'package-lock.json'],
      },
      properties: [
        {
          allowed: ['dependencies', 'devDependencies'],
          files: ['package.json'],
        },
      ],
      versionBump: {
        packageManager: 'npm',
        versionBumpType: 'minor',
      },
    };

    const config: BotConfig = {
      approvalRules: [rule],
    };

    expect(await canBeApproved(mockGithubParameters, config)).toBe(true);

    config.approvalRules = [
      {
        ...rule,
        versionBump: {
          packageManager: 'npm',
          versionBumpType: 'patch',
        },
      },
    ];

    expect(await canBeApproved(mockGithubParameters, config)).toBe(false);
  });

  it('should reject disallowed properties', async () => {
    const rule: RuleValidators = {
      changedFiles: {
        allowed: ['package.json', 'package-lock.json'],
      },
      properties: [
        {
          files: ['package.json'],
          allowed: ['*'],
        },
      ],
      versionBump: {
        packageManager: 'npm',
        versionBumpType: 'major',
      },
    };
    const config: BotConfig = {
      approvalRules: [rule],
    };

    expect(await canBeApproved(mockGithubParameters, config)).toBe(true);

    config.approvalRules = [
      {
        ...rule,
        properties: [
          {
            files: ['package.json'],
            allowed: ['*'],
            disallowed: ['devDependencies'],
          },
        ],
      },
    ];

    expect(await canBeApproved(mockGithubParameters, config)).toBe(false);
  });

  it('should perform version checking only on dependencies', async () => {
    (getObjectFileDiff as jest.Mock).mockResolvedValue(majorBumpsDiff);

    const rule: RuleValidators = {
      changedFiles: {
        allowed: ['package.json', 'package-lock.json', 'translations'],
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
    };
    const config: BotConfig = {
      approvalRules: [rule],
    };

    expect(await canBeApproved(mockGithubParameters, config)).toBe(true);

    config.approvalRules = [
      {
        ...rule,
        versionBump: {
          packageManager: 'npm',
          versionBumpType: 'major',
        },
      },
    ];

    expect(await canBeApproved(mockGithubParameters, config)).toBe(true);
  });

  it('should handle translations', async () => {
    (getChangedFiles as jest.Mock).mockResolvedValue(translationFiles);
    (getObjectFileDiff as jest.Mock).mockResolvedValue([
      {
        keyPath: 'translationVersion.core',
        prevValue: '150',
        newValue: '151',
      },
    ]);

    expect(
      await canBeApproved(mockGithubParameters, {
        approvalRules: [
          {
            changedFiles: {
              allowed: ['package.json', 'package-lock.json', 'translations'],
            },
            properties: [
              {
                files: ['package.json'],
                allowed: ['translationVersion'],
              },
            ],
            versionBump: {
              packageManager: 'npm',
              versionBumpType: 'patch',
            },
          },
        ],
      }),
    ).toBe(true);
  });
});
