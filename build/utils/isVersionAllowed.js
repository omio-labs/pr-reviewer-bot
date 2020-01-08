"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const versionRegex = /^[\^~]?[\d+*]/;
function isVersionAllowed(allowedVersionBump, originalVersion, currentVersion) {
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
exports.default = isVersionAllowed;
