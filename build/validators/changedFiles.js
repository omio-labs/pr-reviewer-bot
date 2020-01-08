"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const githubApi_1 = require("../utils/githubApi");
const isPathAllowed_1 = require("../utils/isPathAllowed");
async function default_1(githubParams, options) {
    const changedFiles = await githubApi_1.getChangedFiles(githubParams);
    return changedFiles.every(file => isPathAllowed_1.isFilePathAllowed(options.allowed, options.disallowed || [], file.filename));
}
exports.default = default_1;
