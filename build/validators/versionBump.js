"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const githubApi_1 = require("../utils/githubApi");
const isVersionAllowed_1 = __importDefault(require("../utils/isVersionAllowed"));
const defaultPackageManagerProperties = {
    npm: ['dependencies', 'devDependencies', 'peerDependencies'],
};
async function default_1(githubParams, options) {
    const changedFiles = (await githubApi_1.getChangedFiles(githubParams)).map(file => file.filename);
    if (changedFiles.indexOf('package.json') === -1) {
        return true;
    }
    const changedItems = await githubApi_1.getObjectFileDiff(githubParams, 'package.json');
    const properties = options.properties || defaultPackageManagerProperties[options.packageManager];
    // Check dependency versions
    return changedItems
        .filter(({ keyPath }) => {
        return properties.some(propertyName => keyPath.startsWith(`${propertyName}`));
    })
        .every(({ newValue, prevValue }) => {
        return isVersionAllowed_1.default(options.versionBumpType, prevValue, newValue);
    });
}
exports.default = default_1;
