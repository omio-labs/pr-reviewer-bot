#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = __importDefault(require("./main"));
const { GIT_REPO, PULL_REQUEST_ID, GIT_COMMIT, GITHUB_TOKEN } = process.env;
if (!GIT_REPO || !PULL_REQUEST_ID || !GIT_COMMIT || !GITHUB_TOKEN) {
    throw new Error('Some necessary environment variables are missing.');
}
main_1.default({
    GIT_REPO,
    PR_ID: PULL_REQUEST_ID,
    GIT_COMMIT,
    GITHUB_TOKEN,
}).catch(err => {
    console.error(err);
    process.exit(1);
});
