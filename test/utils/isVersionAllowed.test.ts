import isVersionAllowed from '../../src/utils/isVersionAllowed';

describe('isVersionAllowed()', () => {
  it('should only approve non-major bumps', () => {
    expect(isVersionAllowed('minor', '^2.2.7', '2.2.10')).toBe(true);
    expect(isVersionAllowed('minor', '^2.2.7', '~3.0.0')).toBe(false);
    expect(isVersionAllowed('minor', '^2.2.7', '3')).toBe(false);
    expect(isVersionAllowed('minor', '^2.2.7', '^2.3')).toBe(true);
    expect(isVersionAllowed('patch', '^2.2.7', '^2.2.8')).toBe(true);
  });

  it('should be able to handle special releases', () => {
    expect(isVersionAllowed('major', '~3.9.3', '4.0.0-alpha')).toBe(true);
    expect(isVersionAllowed('major', '~3.9.3', '4.0.0-rc.0')).toBe(true);
    expect(isVersionAllowed('major', '~3.9.3', '4.0.0-rc.9')).toBe(true);
    expect(isVersionAllowed('patch', '~3.9.3', '3.9.4-rc.1')).toBe(true);
    expect(isVersionAllowed('minor', '~3.9.3', '3.9.4-rc.1')).toBe(true);
    expect(isVersionAllowed('patch', '~3.9.3', '3.10.0-rc.1')).toBe(false);
  });

  it('should reject invalid versions', () => {
    expect(isVersionAllowed('major', '1.4.124', '.2')).toBe(false);
    expect(isVersionAllowed('major', '1.4.124', 'asd')).toBe(false);
  });
});
