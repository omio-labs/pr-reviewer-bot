import getObjectDifference from '../../src/utils/getObjectDifference';
import { newPackageJson1, oldPackageJson1, minorBumpsDiff, newPackageJson2, oldPackageJson2, majorBumpsDiff } from '../mocks/packageJsonMocks';

describe('getObjectDifference()', () => {
  it('should get the right diff', () => {
    expect(getObjectDifference(oldPackageJson1, newPackageJson1)).toMatchObject(minorBumpsDiff);
    expect(getObjectDifference(oldPackageJson2, newPackageJson2)).toMatchObject(majorBumpsDiff);
  });

  it('should show diff when value removed', () => {
    expect(
      getObjectDifference(
        {
          peerDependencies: {
            react: '*',
            '@babel/core': '*',
          },
        },
        {
          peerDependencies: {
            '@babel/core': '*',
          },
        },
      ),
    ).toMatchObject([
      {
        keyPath: 'peerDependencies.react',
        prevValue: '*',
      },
    ]);
  });

  it('should show diff when value added', () => {
    expect(
      getObjectDifference(
        {
          peerDependencies: {
            '@babel/core': '*',
          },
        },
        {
          peerDependencies: {
            react: '*',
            '@babel/core': '*',
          },
        },
      ),
    ).toMatchObject([
      {
        keyPath: 'peerDependencies.react',
        newValue: '*',
      },
    ]);
  });
});
