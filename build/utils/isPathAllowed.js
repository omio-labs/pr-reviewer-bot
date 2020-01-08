"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This function escapes all regex special characters in the string except wildcard "*" character.
// This is the only character we wanna support to add magic. If by any reason we decide on
// supporting another regex character in our path, we should remove all this logic and
// make all paths regex.
function normalisePathRegex(path, delimiter) {
    let normalisePath = path.replace(/[[\\^.|?+()/]/g, '\\$&');
    if (normalisePath.length > 3 && normalisePath.lastIndexOf(`\\${delimiter}*`) === normalisePath.length - 3) {
        normalisePath = normalisePath.substring(0, normalisePath.length - 3);
    }
    return new RegExp(normalisePath.replace('*', '.*'));
}
function matchesPath(path, testItem, delimiter) {
    const pathMatchRegex = normalisePathRegex(path, delimiter);
    return pathMatchRegex.test(testItem);
}
exports.matchesPath = matchesPath;
function isPropertyPathAllowed(allowedPaths, disallowedPaths, testItem) {
    const matchesAllowed = allowedPaths.some(path => matchesPath(path, testItem, '.'));
    const matchesDisallowed = disallowedPaths.some(path => matchesPath(path, testItem, '.'));
    return matchesAllowed && !matchesDisallowed;
}
exports.isPropertyPathAllowed = isPropertyPathAllowed;
function isFilePathAllowed(allowedPaths, disallowedPaths, testItem) {
    const matchesAllowed = allowedPaths.some(path => matchesPath(path, testItem, '/'));
    const matchesDisallowed = disallowedPaths.some(path => matchesPath(path, testItem, '/'));
    return matchesAllowed && !matchesDisallowed;
}
exports.isFilePathAllowed = isFilePathAllowed;
