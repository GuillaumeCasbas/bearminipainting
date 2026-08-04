"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
/**
 * Base abstract error class for all custom errors in the application.
 *
 * Ensures proper error inheritance and instanceof checks work correctly.
 * - Sets error.name to the concrete class name (e.g., "CodeNotUniqueError")
 * - Fixes prototype chain so instanceof checks return true
 *
 * @example
 * class CodeNotUniqueError extends BaseError {
 *   constructor(code: string) {
 *     super(`Code '${code}' is not unique`);
 *   }
 * }
 *
 * const error = new CodeNotUniqueError("NMS");
 * error instanceof CodeNotUniqueError; // true
 * error.name; // "CodeNotUniqueError"
 */
class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BaseError = BaseError;
