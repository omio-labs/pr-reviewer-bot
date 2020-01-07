/* eslint-disable @typescript-eslint/camelcase */
import fs from 'fs';
import path from 'path';
import URL from 'url';

import { getFileContents, defaultTransformResponse } from '../../src/utils/githubApi';
import { changedFiles1 } from '../mocks/changedFiles';

const mockObjectFilePath = path.join(__dirname, '../mocks/mockObjectFile');
const getMockObjectFile = (ext = 'json') => fs.readFileSync(`${mockObjectFilePath}.${ext}`).toString();
const mockObjectFile = JSON.parse(getMockObjectFile('json'));

jest.mock('axios', () => ({
  defaults: {},
  get: async (url: string) => {
    if (url.indexOf('/contents/') > -1) {
      return {
        data: {
          ...changedFiles1[0],
          download_url: changedFiles1[0].raw_url,
        },
      };
    }

    const { pathname } = URL.parse(url);

    if (pathname) {
      const ext = pathname.substring(pathname.lastIndexOf('.') + 1);
      let content = getMockObjectFile(ext);

      const transformResponse = defaultTransformResponse(pathname);

      if (transformResponse) {
        content = await transformResponse(content);
      }

      return {
        data: content,
      };
    }

    throw new Error('invalid URL');
  },
}));

describe('githubApi', () => {
  it('should parse object files', async () => {
    const options = { GIT_COMMIT: 'master', GIT_REPO: 'omio-labs/pr-reviewer-bot', PR_ID: '13', GITHUB_TOKEN: 'GITHUB_TOKEN' };

    expect(await getFileContents(options, 'mockObjectFile.json')).toStrictEqual(mockObjectFile);
    expect(await getFileContents(options, 'mockObjectFile.xml')).toStrictEqual(mockObjectFile);
    expect(await getFileContents(options, 'mockObjectFile.yml')).toStrictEqual(mockObjectFile);
  });
});
