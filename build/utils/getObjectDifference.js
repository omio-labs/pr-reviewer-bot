"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flatMap_1 = __importDefault(require("lodash/flatMap"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const concat_1 = __importDefault(require("lodash/concat"));
const uniq_1 = __importDefault(require("lodash/uniq"));
function getObjectDifferenceRecursion(previous, current, parentKey) {
    if (previous === current) {
        return [];
    }
    if (!isObject_1.default(previous) || !isObject_1.default(current)) {
        return [
            {
                keyPath: parentKey,
                prevValue: previous,
                newValue: current,
            },
        ];
    }
    const combinedKeys = uniq_1.default(concat_1.default(Object.keys(previous), Object.keys(current)));
    return flatMap_1.default(combinedKeys, key => {
        // TS has a bug and assumes that variables of type `object` don't have properties that we can access.
        const nextPrevious = previous[key];
        const nextCurrent = current[key];
        const nextParentKey = parentKey ? `${parentKey}.${key}` : key;
        return getObjectDifferenceRecursion(nextPrevious, nextCurrent, nextParentKey);
    });
}
function getObjectDifference(original, current) {
    return getObjectDifferenceRecursion(original, current);
}
exports.default = getObjectDifference;
