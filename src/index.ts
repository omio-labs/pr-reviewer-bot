#! /usr/bin/env node
import main from './main';

const { GIT_REPO, PULL_REQUEST_ID, GIT_COMMIT, GITHUB_TOKEN } = process.env;

if (!GIT_REPO || !PULL_REQUEST_ID || !GIT_COMMIT || !GITHUB_TOKEN) {
  throw new Error('Some necessary environment variables are missing.');
}

main({
  GIT_REPO,
  PR_ID: PULL_REQUEST_ID,
  GIT_COMMIT,
  GITHUB_TOKEN,
}).catch(err => {
  console.error(err);
  process.exit(1);
});
