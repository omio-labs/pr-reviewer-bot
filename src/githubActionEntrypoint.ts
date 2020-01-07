#! /usr/bin/env node
/* eslint-disable @typescript-eslint/camelcase */

import * as core from '@actions/core';
import * as github from '@actions/github';
import pick from 'lodash/pick';
import main from './main';

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN', { required: true });
const GITHUB_SHA = github.context.sha;
const { repository, pull_request } = github.context.payload;

if (!repository || !repository.full_name || !GITHUB_TOKEN || !GITHUB_SHA || !pull_request || !pull_request.number) {
  throw new Error('Some necessary environment variables are missing.');
}

main(
  {
    GIT_REPO: repository.full_name,
    PR_ID: pull_request.number.toString(),
    GIT_COMMIT: GITHUB_SHA,
    GITHUB_TOKEN,
  },
  pick(core, 'info', 'debug', 'error'),
).catch((err: any) => {
  core.setFailed(err);
  process.exit(1);
});
