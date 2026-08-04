"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectCodeNotFoundError = exports.ProjectNotFoundError = exports.CodeNotUniqueError = void 0;
const base_error_1 = require("./base.error");
class CodeNotUniqueError extends base_error_1.BaseError {
    constructor(code) {
        super(`Code '${code}' is not unique`);
        this.code = code;
        this.name = 'CodeNotUniqueError';
    }
}
exports.CodeNotUniqueError = CodeNotUniqueError;
class ProjectNotFoundError extends base_error_1.BaseError {
    constructor(id) {
        super(`Project with id '${id}' not found`);
    }
}
exports.ProjectNotFoundError = ProjectNotFoundError;
class ProjectCodeNotFoundError extends base_error_1.BaseError {
    constructor(code) {
        super(`Project with code '${code}' not found`);
    }
}
exports.ProjectCodeNotFoundError = ProjectCodeNotFoundError;
