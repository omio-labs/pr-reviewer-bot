import { isPropertyPathAllowed, isFilePathAllowed } from '../../src/utils/isPathAllowed';

describe('isPropertyPathAllowed()', () => {
  it('should approve exact patterns', () => {
    expect(isPropertyPathAllowed(['dependencies'], [], 'dependencies')).toBe(true);
    expect(isPropertyPathAllowed(['devDependencies', 'dependencies'], [], 'dependencies')).toBe(true);
  });

  it('should reject exact patterns', () => {
    expect(isPropertyPathAllowed(['version'], [], 'dependencies')).toBe(false);
  });

  it('should approve complex patterns', () => {
    expect(isPropertyPathAllowed(['dependencies'], [], 'dependencies.react'));
    expect(isPropertyPathAllowed(['dependencies'], [], 'dependencies.@babel/frontend-components'));
    expect(isPropertyPathAllowed(['scripts'], [], 'scripts.test'));
    expect(isPropertyPathAllowed(['scripts.test', 'scripts.start'], [], 'scripts.test'));
    expect(isPropertyPathAllowed(['browserslist'], [], 'browserslist.0')); // array properties
  });

  it('should approve wildcard', () => {
    expect(isPropertyPathAllowed(['*'], [], 'name')).toBe(true);
  });

  it('should approve wildcard in string', () => {
    expect(isPropertyPathAllowed(['dependencies.*'], [], 'dependencies.lodash'));
    expect(isPropertyPathAllowed(['dependencies.@babel/*'], [], 'dependencies.@babel/frontend-components'));
    expect(isPropertyPathAllowed(['dependencies.react*'], [], 'dependencies.react'));
    expect(isPropertyPathAllowed(['dependencies.react*'], [], 'dependencies.react-dom'));
    expect(isPropertyPathAllowed(['translationVersion.*'], [], 'translationVersion.core'));
    expect(isPropertyPathAllowed(['dependencies.@babel/*-components'], [], 'dependencies.@babel/frontend-components'));
  });

  it('should be mindful of disallowed exact patterns', () => {
    expect(isPropertyPathAllowed(['*'], ['dependencies'], 'dependencies')).toBe(false);
    expect(isPropertyPathAllowed(['*'], ['dependencies'], 'dependencies.reselect')).toBe(false);
  });

  it('should be mindful of disallowed complex patterns', () => {
    expect(isPropertyPathAllowed(['*'], ['dependencies.reselect'], 'dependencies.redux')).toBe(true);
    expect(isPropertyPathAllowed(['*'], ['dependencies.reselect'], 'dependencies.reselect')).toBe(false);
  });

  it('should be mindful of wildcard in disallowed list', () => {
    expect(isPropertyPathAllowed(['*'], ['dependencies.*'], 'dependencies.reselect')).toBe(false);
    expect(isPropertyPathAllowed(['*'], ['dependencies.*'], 'dependencies')).toBe(false);
    expect(isPropertyPathAllowed(['*'], ['dependencies.react-*'], 'dependencies.@babel/frontend-components')).toBe(true);
    expect(isPropertyPathAllowed(['*'], ['dependencies.react-*'], 'dependencies.react-native')).toBe(false);
    expect(isPropertyPathAllowed(['dependencies.react-*'], ['dependencies.react-native*'], 'dependencies.react-native')).toBe(false);
    expect(isPropertyPathAllowed(['dependencies.react-*'], ['dependencies.react-native-*'], 'dependencies.react-redux')).toBe(true);
    expect(
      isPropertyPathAllowed(['dependencies.@babel*'], ['dependencies.@babel/frontend-components'], 'dependencies.@babel/madeup-components'),
    ).toBe(true);
  });

  it('should work with files as well', () => {
    expect(isFilePathAllowed(['translations'], [], 'translations/en.json')).toBe(true);
    expect(isFilePathAllowed(['translations/*'], [], 'translations/en.json')).toBe(true);
    expect(isFilePathAllowed(['translations'], [], 'src/SomeComponent.js')).toBe(false);
    expect(isFilePathAllowed(['src/types'], [], 'src/SomeComponent.js')).toBe(false);
    expect(isFilePathAllowed(['*'], ['src'], 'src/SomeComponent.js')).toBe(false);
    expect(isFilePathAllowed(['src'], ['src/components/*'], 'src/types/some-type.js')).toBe(true);
    expect(isFilePathAllowed(['src'], ['src/components'], 'src/types/some-type.js')).toBe(true);
  });
});
