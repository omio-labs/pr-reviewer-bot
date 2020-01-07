import http from 'axios';
import isObject from 'lodash/isObject';
import find from 'lodash/find';
import yaml from 'js-yaml';
import { parseStringPromise } from 'xml2js';

import getObjectDifference from './getObjectDifference';
import { File, Review, User } from '../types/github';
import DiffItem from '../types/diff-item';
import GithubParameters from '../types/github-parameters';

http.defaults.timeout = 5000;

const URL_ROOT = `https://api.github.com/repos`;

async function getAuthenticatedUser() {
  const { data } = await http.get(`https://api.github.com/user`);
  return data;
}

export function assignAuthorizationToken(token: string) {
  http.defaults.headers = {
    Accept: 'application/json',
    Authorization: `token ${token}`,
  };
}

export const defaultTransformResponse = (fileName: string) => async (res: string) => {
  if (fileName.endsWith('.json')) {
    return JSON.parse(res);
  }

  if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
    return yaml.safeLoad(res);
  }

  if (fileName.endsWith('.xml')) {
    return parseStringPromise(res);
  }

  return res;
};

export async function getFileContents({ GIT_REPO, GIT_COMMIT }: GithubParameters, fileName: string): Promise<string | object> {
  const { data } = await http.get(`${URL_ROOT}/${GIT_REPO}/contents/${fileName}`);
  const { data: fileContent } = await http.get(data.download_url.replace('/master/', `/${GIT_COMMIT}/`), {
    transformResponse: defaultTransformResponse(fileName),
  });
  return fileContent;
}

export async function getChangedFiles({ GIT_REPO, PR_ID }: GithubParameters): Promise<File[]> {
  const {
    data: fileList,
  }: {
    data: File[];
  } = await http.get(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/files`);

  return fileList;
}

export async function approvePR({ PR_ID, GIT_REPO }: GithubParameters) {
  await http.post(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/reviews`, {
    body: 'Good job! Your PR is auto-approved. Please merge once all tests have passed.',
    event: 'APPROVE',
  });
}

export async function dismissPRApproval({ PR_ID, GIT_REPO }: GithubParameters, reviewId: number) {
  await http.put(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/reviews/${reviewId}/dismissals`, {
    message: 'This PR does not satisfy auto-approval requirements anymore. Please review it manually',
  });
}

export async function getLatestApprovalFromBot({ PR_ID, GIT_REPO }: GithubParameters): Promise<number | null> {
  const { data: reviews }: { data: Review[] } = await http.get(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/reviews`);
  const authenticatedUser: User = await getAuthenticatedUser();
  const botReview = find(reviews, { state: 'APPROVED', user: { login: authenticatedUser.login } });
  if (botReview) {
    return botReview.id;
  }

  return null;
}

export async function getObjectFileDiff(githubParameters: GithubParameters, fileName: string): Promise<DiffItem[]> {
  const [currentContent, originalContent] = await Promise.all([
    getFileContents(githubParameters, fileName),
    getFileContents(
      {
        ...githubParameters,
        GIT_COMMIT: 'master',
      },
      fileName,
    ),
  ]);

  if (isObject(originalContent) && isObject(currentContent)) {
    return getObjectDifference(originalContent, currentContent);
  }

  throw new Error(`${isObject(originalContent) ? 'New' : 'Original'} version of the file is not json.`);
}
