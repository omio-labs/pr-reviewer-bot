import propertiesValidator, { PropertiesValidatorOptions } from '../../src/validators/properties';
import { getChangedFiles, getObjectFileDiff } from '../../src/utils/githubApi';
import { changedFiles1 } from '../mocks/changedFiles';
import mockGithubParameters from '../mocks/mockGithubParameters';
import { minorBumpsDiff, majorBumpsDiff } from '../mocks/packageJsonMocks';

jest.mock('../../src/utils/githubApi');
(getChangedFiles as jest.Mock).mockResolvedValue(changedFiles1);

describe('propertiesValidator', () => {
  it('should only approve allowed properties', async () => {
    const config = [
      {
        files: ['package.json'],
        allowed: ['dependencies', 'devDependencies'],
      },
    ];

    (getObjectFileDiff as jest.Mock).mockResolvedValueOnce(minorBumpsDiff);
    expect(await propertiesValidator(mockGithubParameters, config)).toBe(true);

    (getObjectFileDiff as jest.Mock).mockResolvedValueOnce(majorBumpsDiff);
    expect(await propertiesValidator(mockGithubParameters, config)).toBe(false);
  });

  it('should reject files that are not allowed', async () => {
    const config: PropertiesValidatorOptions = [
      {
        files: ['package.json'],
        allowed: ['*'],
      },
    ];

    (getObjectFileDiff as jest.Mock).mockResolvedValue(majorBumpsDiff);
    expect(await propertiesValidator(mockGithubParameters, config)).toBe(true);

    config[0].disallowed = ['translationVersion'];
    expect(await propertiesValidator(mockGithubParameters, config)).toBe(false);
  });
});
