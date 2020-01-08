"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const BOT_CONFIG_FILE_NAMES = ['.pr-bot.json', '.pr-bot.yml'];
function default_1() {
    const botFileName = BOT_CONFIG_FILE_NAMES.find(fileName => fs.existsSync(fileName));
    if (!botFileName) {
        throw new Error('Bot config not found.');
    }
    const fileContent = fs.readFileSync(botFileName, 'utf8');
    return botFileName.endsWith('.yml') ? yaml.safeLoad(fileContent) : JSON.parse(fileContent);
}
exports.default = default_1;
