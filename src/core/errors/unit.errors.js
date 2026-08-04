"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitCodeNotUniqueError = void 0;
const base_error_1 = require("./base.error");
class UnitCodeNotUniqueError extends base_error_1.BaseError {
    constructor(code) {
        super(`Unit code '${code}' is not unique`);
    }
}
exports.UnitCodeNotUniqueError = UnitCodeNotUniqueError;
