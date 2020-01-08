"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const githubApi_1 = require("../utils/githubApi");
const isPathAllowed_1 = require("../utils/isPathAllowed");
const filterMatchingFiles = (changedFiles, path) => changedFiles.filter(fileName => isPathAllowed_1.matchesPath(path, fileName, '/'));
// Iterates over an array with a function that returns a Promise<boolean>
// then applies `.every` on the results
async function everyPromise(items, iterator) {
    const promises = items.map(iterator);
    const results = await Promise.all(promises);
    return results.every(Boolean);
}
async function isPropertyChangeAllowed(githubParams, objectFileName, options) {
    const changedItems = await githubApi_1.getObjectFileDiff(githubParams, objectFileName);
    const { allowed, disallowed } = options;
    return changedItems.every(({ keyPath }) => isPathAllowed_1.isPropertyPathAllowed(allowed, disallowed || [], keyPath));
}
async function default_1(githubParams, optionsList) {
    const changedFiles = (await githubApi_1.getChangedFiles(githubParams)).map(file => file.filename);
    return everyPromise(optionsList, async (options) => {
        return everyPromise(options.files, async (filePath) => {
            const matchingFiles = filterMatchingFiles(changedFiles, filePath);
            return everyPromise(matchingFiles, fileName => isPropertyChangeAllowed(githubParams, fileName, options));
        });
    });
}
exports.default = default_1;
