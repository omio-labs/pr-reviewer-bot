"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const find_1 = __importDefault(require("lodash/find"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const xml2js_1 = require("xml2js");
const getObjectDifference_1 = __importDefault(require("./getObjectDifference"));
axios_1.default.defaults.timeout = 5000;
const URL_ROOT = `https://api.github.com/repos`;
async function getAuthenticatedUser() {
    const { data } = await axios_1.default.get(`https://api.github.com/user`);
    return data;
}
function assignAuthorizationToken(token) {
    axios_1.default.defaults.headers = {
        Accept: 'application/json',
        Authorization: `token ${token}`,
    };
}
exports.assignAuthorizationToken = assignAuthorizationToken;
exports.defaultTransformResponse = (fileName) => async (res) => {
    if (fileName.endsWith('.json')) {
        return JSON.parse(res);
    }
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
        return js_yaml_1.default.safeLoad(res);
    }
    if (fileName.endsWith('.xml')) {
        return xml2js_1.parseStringPromise(res);
    }
    return res;
};
async function getFileContents({ GIT_REPO, GIT_COMMIT }, fileName) {
    const { data } = await axios_1.default.get(`${URL_ROOT}/${GIT_REPO}/contents/${fileName}`);
    const { data: fileContent } = await axios_1.default.get(data.download_url.replace('/master/', `/${GIT_COMMIT}/`), {
        transformResponse: exports.defaultTransformResponse(fileName),
    });
    return fileContent;
}
exports.getFileContents = getFileContents;
async function getChangedFiles({ GIT_REPO, PR_ID }) {
    const { data: fileList, } = await axios_1.default.get(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/files`);
    return fileList;
}
exports.getChangedFiles = getChangedFiles;
async function approvePR({ PR_ID, GIT_REPO }) {
    await axios_1.default.post(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/reviews`, {
        body: 'Good job! Your PR is auto-approved. Please merge once all tests have passed.',
        event: 'APPROVE',
    });
}
exports.approvePR = approvePR;
async function dismissPRApproval({ PR_ID, GIT_REPO }, reviewId) {
    await axios_1.default.put(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/reviews/${reviewId}/dismissals`, {
        message: 'This PR does not satisfy auto-approval requirements anymore. Please review it manually',
    });
}
exports.dismissPRApproval = dismissPRApproval;
async function getLatestApprovalFromBot({ PR_ID, GIT_REPO }) {
    const { data: reviews } = await axios_1.default.get(`${URL_ROOT}/${GIT_REPO}/pulls/${PR_ID}/reviews`);
    const authenticatedUser = await getAuthenticatedUser();
    const botReview = find_1.default(reviews, { state: 'APPROVED', user: { login: authenticatedUser.login } });
    if (botReview) {
        return botReview.id;
    }
    return null;
}
exports.getLatestApprovalFromBot = getLatestApprovalFromBot;
async function getObjectFileDiff(githubParameters, fileName) {
    const [currentContent, originalContent] = await Promise.all([
        getFileContents(githubParameters, fileName),
        getFileContents({
            ...githubParameters,
            GIT_COMMIT: 'master',
        }, fileName),
    ]);
    if (isObject_1.default(originalContent) && isObject_1.default(currentContent)) {
        return getObjectDifference_1.default(originalContent, currentContent);
    }
    throw new Error(`${isObject_1.default(originalContent) ? 'New' : 'Original'} version of the file is not json.`);
}
exports.getObjectFileDiff = getObjectFileDiff;
