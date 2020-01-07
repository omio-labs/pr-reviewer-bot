import changedFilesValidator from '../../src/validators/changedFiles';
import { getChangedFiles } from '../../src/utils/githubApi';
import { changedFiles1, translationFiles } from '../mocks/changedFiles';
import mockGithubParameters from '../mocks/mockGithubParameters';

jest.mock('../../src/utils/githubApi');

describe('changedFilesValidator', () => {
  it('should approve allowed files', async () => {
    (getChangedFiles as jest.Mock).mockResolvedValue(changedFiles1);

    expect(
      await changedFilesValidator(mockGithubParameters, {
        allowed: ['package.json', 'package-lock.json'],
      }),
    ).toBe(true);
  });

  it('should reject files that are not allowed', async () => {
    (getChangedFiles as jest.Mock).mockResolvedValue(translationFiles);

    expect(
      await changedFilesValidator(mockGithubParameters, {
        allowed: ['package.json', 'package-lock.json'],
      }),
    ).toBe(false);
  });
});
