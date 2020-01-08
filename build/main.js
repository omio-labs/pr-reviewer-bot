"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const canBeApproved_1 = __importDefault(require("./utils/canBeApproved"));
const loadBotConfig_1 = __importDefault(require("./utils/loadBotConfig"));
const githubApi_1 = require("./utils/githubApi");
const messages_json_1 = __importDefault(require("./config/messages.json"));
async function main(botOptions, logger = console) {
    githubApi_1.assignAuthorizationToken(botOptions.GITHUB_TOKEN);
    const botConfig = loadBotConfig_1.default();
    const reviewId = await githubApi_1.getLatestApprovalFromBot(botOptions);
    if (await canBeApproved_1.default(botOptions, botConfig)) {
        if (!reviewId) {
            await githubApi_1.approvePR(botOptions);
            logger.info(messages_json_1.default.SUCCESSFULLY_APPROVED);
        }
        else {
            logger.info(messages_json_1.default.ALREADY_APPROVED);
        }
    }
    else if (reviewId) {
        await githubApi_1.dismissPRApproval(botOptions, reviewId);
        logger.info(messages_json_1.default.APPROVAL_DISMISSED);
    }
    else {
        logger.info(messages_json_1.default.NOT_ELIGIBLE);
    }
}
exports.default = main;
