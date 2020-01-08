#! /usr/bin/env node
"use strict";
/* eslint-disable @typescript-eslint/camelcase */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const pick_1 = __importDefault(require("lodash/pick"));
const main_1 = __importDefault(require("./main"));
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN', { required: true });
const GITHUB_SHA = github.context.sha;
const { repository, pull_request } = github.context.payload;
if (!repository || !repository.full_name || !GITHUB_TOKEN || !GITHUB_SHA || !pull_request || !pull_request.number) {
    throw new Error('Some necessary environment variables are missing.');
}
main_1.default({
    GIT_REPO: repository.full_name,
    PR_ID: pull_request.number.toString(),
    GIT_COMMIT: GITHUB_SHA,
    GITHUB_TOKEN,
}, pick_1.default(core, 'info', 'debug', 'error')).catch((err) => {
    core.setFailed(err);
    process.exit(1);
});
