"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentenceCase = void 0;
function sentenceCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
exports.sentenceCase = sentenceCase;
