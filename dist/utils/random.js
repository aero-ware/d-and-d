"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randInt = void 0;
/**
 * Returns a random integer between min and max, inclusive.
 * @param min the minimum number to return
 * @param max the maximum number to return
 * @returns random integer between min and max
 */
function randInt(min, max) {
    if (!Number.isInteger(min))
        throw new TypeError("parameter 'min' must be an integer.");
    if (!Number.isInteger(max))
        throw new TypeError("parameter 'max' must be an integer.");
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.randInt = randInt;
