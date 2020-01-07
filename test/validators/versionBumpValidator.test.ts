import versionBumpValidator, { VersionBumpValidatorOptions } from '../../src/validators/versionBump';
import { getChangedFiles, getObjectFileDiff } from '../../src/utils/githubApi';
import { changedFiles1 } from '../mocks/changedFiles';
import mockGithubParameters from '../mocks/mockGithubParameters';

jest.mock('../../src/utils/githubApi');
(getChangedFiles as jest.Mock).mockResolvedValue(changedFiles1);

describe('changedFilesValidator', () => {
  it('should only approve minor version bumps', async () => {
    const config: VersionBumpValidatorOptions = {
      packageManager: 'npm',
      versionBumpType: 'minor',
    };

    (getObjectFileDiff as jest.Mock).mockResolvedValueOnce([
      { keyPath: 'dependencies.@babel/cli', newValue: '^5.8.0', prevValue: '^5.7.3' },
      { keyPath: 'devDependencies.@types/node', newValue: '^12.6.2', prevValue: '^12.5.2' },
      { keyPath: 'peerDependencies.styled-components', newValue: '3.4.0', prevValue: '3.3.4' },
    ]);
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(true);

    (getObjectFileDiff as jest.Mock).mockResolvedValueOnce([
      { keyPath: 'dependencies.@babel/cli', newValue: '^5.8.0', prevValue: '^5.7.3' },
      { keyPath: 'devDependencies.@types/node', newValue: '^13.0.0', prevValue: '^12.5.2' },
      { keyPath: 'peerDependencies.styled-components', newValue: '3.4.0', prevValue: '3.3.4' },
    ]);
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(false);

    (getObjectFileDiff as jest.Mock).mockResolvedValueOnce([
      { keyPath: 'dependencies.@babel/cli', newValue: '^5.8.0', prevValue: '^5.7.3' },
      { keyPath: 'devDependencies.@types/node', newValue: '^12.6.2', prevValue: '^12.5.2' },
      { keyPath: 'peerDependencies.styled-components', newValue: '3.4.0', prevValue: '*' },
    ]);
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(false);
  });

  it('should approve all version bumps', async () => {
    const config: VersionBumpValidatorOptions = {
      packageManager: 'npm',
      versionBumpType: 'major',
    };

    (getObjectFileDiff as jest.Mock).mockResolvedValueOnce([
      { keyPath: 'dependencies.@babel/cli', newValue: '^5.8.0', prevValue: '^5.7.3' },
      { keyPath: 'devDependencies.@types/node', newValue: '^13.0.0', prevValue: '^12.5.2' },
    ]);
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(true);
  });

  it('should use the properties field when set', async () => {
    const config: VersionBumpValidatorOptions = {
      packageManager: 'npm',
      versionBumpType: 'minor',
    };

    (getObjectFileDiff as jest.Mock).mockResolvedValue([
      { keyPath: 'dependencies.@babel/cli', newValue: '^5.8.0', prevValue: '^5.7.3' },
      { keyPath: 'devDependencies.@types/node', newValue: '^12.6.0', prevValue: '^12.5.2' },
      { keyPath: 'peerDependencies.styled-components', newValue: '4.4.0', prevValue: '3.3.4' },
    ]);
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(false);

    // peerDependencies is missing
    config.properties = ['devDependencies', 'dependencies'];
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(true);

    // translationVersion added
    (getObjectFileDiff as jest.Mock).mockResolvedValue([
      { keyPath: 'dependencies.@babel/cli', newValue: '^5.8.0', prevValue: '^5.7.3' },
      { keyPath: 'devDependencies.@types/node', newValue: '^13.0.0', prevValue: '^12.5.2' },
      { keyPath: 'peerDependencies.styled-components', newValue: '3.4.0', prevValue: '3.3.4' },
      { keyPath: 'translationVersion', newValue: '151', prevValue: '150' },
    ]);
    config.properties = ['devDependencies', 'dependencies', 'peerDependencies', 'translationVersion'];
    config.versionBumpType = 'major';
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(true);

    config.versionBumpType = 'minor';
    expect(await versionBumpValidator(mockGithubParameters, config)).toBe(false);
  });
});
