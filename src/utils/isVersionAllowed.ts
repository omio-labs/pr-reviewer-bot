import { VersionBumpType } from '../validators/versionBump';

const versionRegex = /^[\^~]?[\d+*]/;

export default function isVersionAllowed(allowedVersionBump: VersionBumpType, originalVersion: string, currentVersion: string): boolean {
  if (!versionRegex.test(originalVersion) || !versionRegex.test(currentVersion)) {
    return false;
  }

  const [originalMajor, originalMinor] = originalVersion.replace(/['^~]/g, '').split('.');
  const [currentMajor, currentMinor] = currentVersion.replace(/['^~]/g, '').split('.');

  if (allowedVersionBump === 'major') {
    return true;
  }

  if (allowedVersionBump === 'minor' && currentMajor === originalMajor) {
    return true;
  }

  return Boolean(currentMinor) && Boolean(originalMinor) && currentMinor === originalMinor;
}
